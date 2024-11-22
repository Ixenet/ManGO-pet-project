# ManGO

**ManGO** is a web-based manga library built using **React** for the frontend and **Express** with **PostgreSQL** for the backend. It includes a simple account system with user and admin roles, allowing administrators to add and remove manga.

## Features

- **Manga Reading**: Users can browse and read manga.
- **Manga Management**: Admins can add or delete manga.
- **User Registration and Login**: Create an account and authenticate.
- **User Roles**: Regular users and administrators with extended privileges.

## Technologies

- **Frontend**: React, React Router
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: bcryptjs and JWT for secure API protection.

## Project Structure

### Frontend (React)

- **Site**
  - `node_modules`
  - `public`
    - `images`: Contains main project images such as manga covers.
      - `mangaPanels`, `newsPanels`, `slides`
      - `background.jpg`
  - `src`
    - `components`
      - `mainPageElements`: Components for the homepage.
        - `footer.js`, `header.js`, `mangaSet.js`, `newsSector.js`, `SlideShow.js`
      - `mangaPageElements`: Components for manga pages.
        - `additionalInfo.js`, `likeThis.js`, `mainInfo.js`
      - `styles`: CSS files for specific pages and components.
    - `addManga.js`: React page for adding manga.
    - `App.js`: Implements routing and route protection.
    - `authorizationPage.js`: User login and JWT generation.
    - `cataloguePage.js`: Manga catalog with filters.
    - `index.js`
    - `mainPage.js`: Homepage, integrating main page components.
    - `mangaPage.js`: Manga detail page.
    - `newsPage.js`: News page.

### Backend (Express)

- **Api**
  - `node_modules`
  - `.env`: Configuration file for database and JWT.
  - `authenticationController.js`: Handles authentication requests.
  - `index.js`: Combines manga and authentication routes.
  - `mangaController.js`: Handles manga-related requests.

## Installation and Setup

### Prerequisites

Ensure you have the following installed:
- **Node.js** (version 14+)
- **PostgreSQL** (any recent version)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Ixenet/ManGO.git
   cd ManGO
   ```

2. **Set Up the Backend**

   - Navigate to the `Api` directory:
     ```bash
     cd Api
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file with your database and JWT configuration:
     ```env
     DB_USER="your_db_user"
     DB_PASSWORD="your_db_password"
     DB_NAME="mango_or_your_db_name"
     SECRET_KEY="your_jwt_secret"
     ```
   - Start the server:
     ```bash
     npm start
     ```

3. **Set Up the Frontend**

   - Navigate to the `Site/mango` directory:
     ```bash
     cd ../Site/mango
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the React app:
     ```bash
     npm start
     ```

### Using the Application

- **Register/Login**: Create an account or log in.
- **Browse Manga**: Use the homepage to explore manga.
- **Admin Panel**: Admins can manage manga via the admin panel.

## API Documentation

| Method | Endpoint        | Description                          |
|--------|-----------------|--------------------------------------|
| POST   | `/registration` | User registration                   |
| POST   | `/login`        | User login                          |
| POST   | `/add/manga`    | Add new manga (admin only)          |
| POST   | `/add/news`     | Add news articles (admin only)      |
| GET    | `/get/manga`    | Retrieve all manga                  |
| GET    | `/get/news`     | Retrieve all news                   |
| GET    | `/get/manga/:key` | Retrieve manga by ID or genre       |
| GET    | `/get/news/:id` | Retrieve news by ID                 |
| POST   | `/delete/manga` | Delete manga (admin only)           |

## TODO

- Enhance the user interface.
- Add pages for manga chapters.
- Implement commenting on manga chapters.
- Add user profile pages.
- Introduce a rating system.
