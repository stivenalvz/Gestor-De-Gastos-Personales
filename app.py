from flask import Flask, jsonify, request, render_template, redirect, url_for, flash, session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from dotenv import load_dotenv
import mysql.connector
import os
from functools import wraps
from decimal import Decimal

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Database configuration
db_config = {
    'host': os.getenv('DB_HOST'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME')
}

def decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    return obj

def json_response(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return decorated_function

def get_db_connection():
    return mysql.connector.connect(**db_config)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Custom decorator to verify user authentication
def login_required_custom(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Decorator to redirect authenticated users
def redirect_if_authenticated(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if current_user.is_authenticated:
            return redirect(url_for('dashboard'))
        return f(*args, **kwargs)
    return decorated_function

class User(UserMixin):
    def __init__(self, id, name, email, password):
        self.id = id
        self.name = name
        self.email = email
        self.password = password

@login_manager.user_loader
def load_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user:
        return User(user['id'], user['name'], user['email'], user['password'])
    return None

# Main routes
@app.route('/')
@redirect_if_authenticated
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
@redirect_if_authenticated
def login():
    if request.method == 'POST':
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'error': 'All fields are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        try:
            cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
            user = cursor.fetchone()
            
            if user and check_password_hash(user['password'], password):
                user_obj = User(user['id'], user['name'], user['email'], user['password'])
                login_user(user_obj)
                return jsonify({
                    'message': 'Login successful',
                    'redirect': '/dashboard'
                }), 200
            else:
                return jsonify({'error': 'Incorrect email or password'}), 401
                
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            cursor.close()
            conn.close()
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
@redirect_if_authenticated
def register():
    if request.method == 'POST':
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if not all([name, email, password]):
            return jsonify({'error': 'All fields are required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        try:
            cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
            if cursor.fetchone():
                return jsonify({'error': 'Email already registered'}), 400
            
            hashed_password = generate_password_hash(password)
            cursor.execute(
                'INSERT INTO users (name, email, password) VALUES (%s, %s, %s)',
                (name, email, hashed_password)
            )
            user_id = cursor.lastrowid
            
            conn.commit()
            
            # Create user and automatic login
            user = User(user_id, name, email, hashed_password)
            login_user(user)
            
            return jsonify({
                'message': 'User registered successfully',
                'redirect': '/dashboard'
            }), 201
            
        except Exception as e:
            conn.rollback()
            return jsonify({'error': str(e)}), 500
        finally:
            cursor.close()
            conn.close()
    
    return render_template('register.html')

@app.route('/dashboard')
@login_required_custom
def dashboard():
    return render_template('dashboard.html')

@app.route('/logout', methods=['GET', 'POST'])
@login_required_custom
def logout():
    logout_user()
    # Clear session
    session.clear()
    return jsonify({'message': 'Session closed successfully'}), 200

# API Routes (all protected)
@app.route('/api/transactions', methods=['GET'])
@login_required_custom
def get_transactions():
    try:
        page = request.args.get('page', 1, type=int)
        type = request.args.get('type')
        per_page = 10
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Build base query
        query = '''
            SELECT COUNT(*) as total 
            FROM transactions 
            WHERE user_id = %s
        '''
        params = [current_user.id]
        
        # Add type filter if specified
        if type:
            query += ' AND type = %s'
            params.append(type)
        
        # Get total transactions
        cursor.execute(query, tuple(params))
        total = cursor.fetchone()['total']
        
        # Calculate offset
        offset = (page - 1) * per_page
        
        # Build query to get transactions
        query = '''
            SELECT t.*, c.name as category_name
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = %s
        '''
        params = [current_user.id]
        
        # Add type filter if specified
        if type:
            query += ' AND t.type = %s'
            params.append(type)
        
        query += ' ORDER BY t.created_at DESC LIMIT %s OFFSET %s'
        params.extend([per_page, offset])
        
        # Get transactions
        cursor.execute(query, tuple(params))
        transactions = cursor.fetchall()
        
        # Convert Decimal values to float
        processed_transactions = []
        for t in transactions:
            processed_transaction = {
                'id': t['id'],
                'date': t['created_at'].strftime('%Y-%m-%d %H:%M:%S'),
                'amount': float(t['amount']) if t['amount'] is not None else 0.0,
                'type': t['type'],
                'description': t['description'],
                'category': t['category_name']
            }
            processed_transactions.append(processed_transaction)
            
        return jsonify({
            'transactions': processed_transactions,
            'total': total,
            'pages': (total + per_page - 1) // per_page,
            'current_page': page
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/transactions/<int:transaction_id>', methods=['GET'])
@login_required_custom
def get_transaction(transaction_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get the transaction with category name
        cursor.execute('''
            SELECT t.*, c.name as category_name
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.id = %s AND t.user_id = %s
        ''', (transaction_id, current_user.id))
        
        transaction = cursor.fetchone()
        if not transaction:
            return jsonify({'error': 'Transaction not found'}), 404
            
        # Convert date to string and amount to float
        processed_transaction = {
            'id': transaction['id'],
            'type': transaction['type'],
            'amount': float(transaction['amount']),
            'category_id': transaction['category_id'],
            'description': transaction['description'],
            'date': transaction['created_at'].strftime('%Y-%m-%d'),
            'user_id': transaction['user_id']
        }
            
        return jsonify(processed_transaction)
        
    except Exception as e:
        print(f"Error in get_transaction: {str(e)}")  # Para depuración
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/transactions/<int:transaction_id>', methods=['PUT'])
@login_required_custom
def update_transaction(transaction_id):
    try:
        data = request.get_json()
        
        # Validate required data
        required_fields = ['type', 'amount', 'category_id', 'date']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Field {field} is required'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Verify that the transaction exists and belongs to the user
        cursor.execute('''
            SELECT * FROM transactions 
            WHERE id = %s AND user_id = %s
        ''', (transaction_id, current_user.id))
        
        actual_transaction = cursor.fetchone()
        if not actual_transaction:
            return jsonify({'error': 'Transaction not found'}), 404
        
        # Update the transaction
        cursor.execute('''
            UPDATE transactions 
            SET type = %s, amount = %s, category_id = %s, 
                description = %s, created_at = %s
            WHERE id = %s
        ''', (
            data['type'],
            float(data['amount']),
            data['category_id'],
            data.get('description', ''),
            data['date'],
            transaction_id
        ))
        
        conn.commit()
        return jsonify({'message': 'Transaction updated successfully'})
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/transactions', methods=['POST'])
@login_required_custom
@json_response
def create_transaction():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['type', 'amount', 'category_id', 'date']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Get database connection
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert transaction
        cursor.execute('''
            INSERT INTO transactions (user_id, type, amount, category_id, description, date)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (
            current_user.id,
            data['type'],
            data['amount'],
            data['category_id'],
            data.get('description', ''),
            data['date']
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'Transaction created successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/categories', methods=['GET'])
@login_required_custom
@json_response
def get_categories():
    if not current_user.is_authenticated:
        return jsonify({'error': 'Not authenticated'}), 401
        
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM categories')
    categories = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(categories)

@app.route('/api/accounts', methods=['GET'])
@login_required_custom
@json_response
def get_accounts():
    if not current_user.is_authenticated:
        return jsonify({'error': 'Not authenticated'}), 401
        
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM accounts WHERE user_id = %s', (current_user.id,))
        accounts = cursor.fetchall()
        
        # Convert Decimal values to float
        processed_accounts = []
        for account in accounts:
            processed_account = {
                'id': account['id'],
                'name': account['name'],
                'type': account['type'],
                'balance': float(account['balance']) if account['balance'] is not None else 0.0,
                'user_id': account['user_id']
            }
            processed_accounts.append(processed_account)
            
        return jsonify(processed_accounts)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/accounts', methods=['POST'])
@login_required_custom
def create_account():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO accounts (name, type, balance, user_id)
            VALUES (%s, %s, 0.0, %s)
        ''', (data['name'], data['type'], current_user.id))
        
        conn.commit()
        return jsonify({'message': 'Account created successfully'}), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@app.route('/api/summary', methods=['GET'])
@login_required_custom
@json_response
def get_summary():
    if not current_user.is_authenticated:
        return jsonify({'error': 'Not authenticated'}), 401
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get current date
        today = datetime.now()
        start_month = datetime(today.year, today.month, 1)
        end_month = (start_month + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        
        # Get totals for the current month
        cursor.execute('''
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as incomes,
                COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expenses
            FROM transactions
            WHERE user_id = %s AND created_at >= %s AND created_at <= %s
        ''', (current_user.id, start_month, end_month))
        totals = cursor.fetchone()
        
        # Calculate total balance (sum of all incomes minus all expenses)
        cursor.execute('''
            SELECT 
                COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as total_balance
            FROM transactions
            WHERE user_id = %s
        ''', (current_user.id,))
        total_balance = cursor.fetchone()['total_balance']

        # Get data for income vs expense graph (last 6 months)
        cursor.execute('''
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as incomes,
                SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expenses
            FROM transactions
            WHERE user_id = %s
            AND created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month
        ''', (current_user.id,))
        graph_data = cursor.fetchall()

        # Get data for income categories graph (current month)
        cursor.execute('''
            SELECT 
                c.id,
                c.name,
                COALESCE(SUM(t.amount), 0) as total
            FROM categories c
            LEFT JOIN transactions t ON t.category_id = c.id 
                AND t.user_id = %s 
                AND t.type = 'income'
                AND t.created_at >= %s
                AND t.created_at <= %s
            WHERE c.type = 'income'
            GROUP BY c.id, c.name
            ORDER BY total DESC
        ''', (current_user.id, start_month, end_month))
        category_incomes = cursor.fetchall()

        # Get data for expense categories graph (current month)
        cursor.execute('''
            SELECT 
                c.id,
                c.name,
                COALESCE(SUM(t.amount), 0) as total
            FROM categories c
            LEFT JOIN transactions t ON t.category_id = c.id 
                AND t.user_id = %s 
                AND t.type = 'expense'
                AND t.created_at >= %s
                AND t.created_at <= %s
            WHERE c.type = 'expense'
            GROUP BY c.id, c.name
            ORDER BY total DESC
        ''', (current_user.id, start_month, end_month))
        category_expenses = cursor.fetchall()
        
        return jsonify({
            'total_balance': float(total_balance),
            'incomes_month': float(totals['incomes']),
            'expenses_month': float(totals['expenses']),
            'savings_month': float(totals['incomes'] - totals['expenses']),
            'graph_data': [{
                'month': d['month'],
                'incomes': float(d['incomes']),
                'expenses': float(d['expenses'])
            } for d in graph_data],
            'category_incomes': [{
                'name': g['name'],
                'total': float(g['total'])
            } for g in category_incomes],
            'category_expenses': [{
                'name': g['name'],
                'total': float(g['total'])
            } for g in category_expenses],
            'has_records': len(graph_data) > 0
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/transactions/<int:transaction_id>', methods=['DELETE'])
@login_required_custom
def delete_transaction(transaction_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Verify that the transaction exists and belongs to the current user
        cursor.execute('''
            SELECT * FROM transactions 
            WHERE id = %s AND user_id = %s
        ''', (transaction_id, current_user.id))
        
        transaction = cursor.fetchone()
        if not transaction:
            return jsonify({'error': 'Transaction not found'}), 404
        
        # Delete the transaction
        cursor.execute('DELETE FROM transactions WHERE id = %s', (transaction_id,))
        
        conn.commit()
        return jsonify({'message': 'Transaction deleted successfully'})
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/income/history', methods=['GET'])
@login_required_custom
@json_response
def get_income_history():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get income history by month
        cursor.execute('''
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COALESCE(SUM(amount), 0) as total
            FROM transactions 
            WHERE user_id = %s AND type = 'income'
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month DESC
            LIMIT 12
        ''', (current_user.id,))
        
        income_history = cursor.fetchall()
        
        # Convert Decimal to float
        processed_history = []
        for record in income_history:
            processed_history.append({
                'month': record['month'],
                'total': float(record['total'])
            })
        
        return jsonify(processed_history)
        
    except Exception as e:
        print(f"Error in get_income_history: {str(e)}")  # Para depuración
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/expenses/history', methods=['GET'])
@login_required_custom
@json_response
def get_expenses_history():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Get expenses history by month
        cursor.execute('''
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COALESCE(SUM(amount), 0) as total
            FROM transactions 
            WHERE user_id = %s AND type = 'expense'
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month DESC
            LIMIT 12
        ''', (current_user.id,))
        
        expenses_history = cursor.fetchall()
        
        # Convert Decimal to float
        processed_history = []
        for record in expenses_history:
            processed_history.append({
                'month': record['month'],
                'total': float(record['total'])
            })
        
        return jsonify(processed_history)
        
    except Exception as e:
        print(f"Error in get_expenses_history: {str(e)}")  # Para depuración
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(host='0.0.0.0', port=port)