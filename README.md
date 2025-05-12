# FinazApp - Personal Finance Manager


#### Description:

**Personal Finance Manager** is a web application developed with **Flask (Python)** to help users manage their personal finances efficiently, intuitively, and securely.

The application allows users to:

- Record income and expenses in different categories.
- Generate a general balance to know the financial status in real-time.
- Visualize information with **dynamic charts** to facilitate understanding.
- Create a personal account with an authentication system (registration and login).
- Store all user information in a **MySQL database**.

The frontend design is modern and attractive, with a user-friendly interface, and all communication between frontend and backend is done through **AJAX**, which minimizes page reloads and improves the user experience.

---

### 💻 Technologies Used:

- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Backend**: Python with Flask
- **Database**: MySQL
- **Charts**: Chart.js
- **AJAX**: jQuery for asynchronous calls

---

### 📁 Project Structure:

- `app.py`: Main entry point of the Flask application.
- `templates/`: Contains HTML templates (login, dashboard, registration, etc.).
- `static/`: Static files such as CSS, JS, and graphic resources.
- `database.sql`: Script to create MySQL database tables.
- `README.md`: This file.
- `requirements.txt`: List of dependencies needed to run the project.
- `Dockerfile`: Defines how to build the Flask application container image.
- `docker-compose.yml`: Orchestrates services such as the app and database (MySQL) in containers, with hardcoded credentials for ease of deployment (no .env file is uploaded to the repository).
---

### 🔐 Security

- Passwords are stored using hashing.
- User sessions are secure and managed with Flask Login.
- SQL queries are protected against injections through the use of parameters and ORM.

---

### ⚙️ Installation and Usage

#### 🔧 Option 1: Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/stivenalvz/Gestor-De-Gastos-Personales.git
   cd Gestor-De-Gastos-Personales
   ```

2. In the project directory, run:
   ```bash
   docker-compose up --build
   ```

3. Access the application at:
   [http://localhost](http://localhost)

4. To stop the containers:
   ```bash
   docker-compose down
   ```

5. To stop the containers and delete the volumen:
   ```bash
   docker-compose down -v
   ```


---

### 🚀 Getting Started

1. Register in the application by creating a new account.
2. Log in with your credentials.
3. Start recording your financial transactions.
4. Explore the charts to analyze your finances.

---

### 📊 Main Features

- **Dashboard**: Overview of your financial situation with charts and summaries.
- **Transaction Recording**: Add income and expenses with dates, categories, and notes.

---