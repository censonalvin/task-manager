# Task Manager Application

## Description
This Task Manager Application is a portfolio project designed to showcase my skills in full-stack development. It allows users to manage their projects and tasks efficiently. Users can register, log in, create, view, update, and delete projects and tasks. Additionally, users can change their email and password via modals. The application is built with a React frontend, a Node.js/Express backend, and MongoDB for the database.

## Features
- User registration and login
- Project creation, viewing, updating, and deletion
- Task management within projects
- Change email and password via modals
- View profile information and associated projects

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-manager.git
   ```

2. Navigate to the project directory:
   ```bash
   cd task-manager
   ```

3. Install dependencies for both the backend and frontend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     ```

5. Start the development servers:
   - For the backend:
     ```bash
     cd backend && npm run dev
     ```
   - For the frontend:
     ```bash
     cd ../frontend && npm start
     ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Register a new user or log in with an existing account.
3. Create and manage projects and tasks.
4. Update your email or password via the settings modals.

## Technologies Used

### Frontend
- React
- React Router
- Axios
- Bootstrap (for modals and UI components)

### Backend
- Node.js
- Express
- JWT (JSON Web Tokens) for authentication
- bcrypt for password hashing

### Database
- MongoDB

## Contributing

This is a portfolio project and is not open for contributions. However, feedback and suggestions are always welcome!

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Special thanks to the open-source community for providing tools and resources that made this project possible.

