
# ProMan - Task Manager Web Application
An application for project management applicable for small teams. Create accounts, projects, tasks, teams and manage all of it by assigning roles to team members, having different scope of access levels, and assign tasks within teams to specific members.

## Tech Stack
The application's main focus is on using JavaScript to dynamically create and modify DOM elements, providing features communicating with the web server through AJAX calls. The application is written in a procedural style, communicating with the persistence layer through psycopg2 driver, using pure SQL.

Web server endpoints are protected server side to allow access only to users who are eligible to use certain function given their current login/team/board status. Input is validated both server and client side all throughout the app.

SQL file is defined with the mindset to include multi-level connections between tables and utilize the power of triggers, procedures and constraints to guarantee data integrity at any point.

- Python Flask Framework - Werkzeug Web Server - Jinja Templating Engine
- PostgreSQL Database
- JavaScript / jQuery / AJAX
- HTML, CSS, Bootstrap (grid system)

## Features
The application is currently capable of the following functionality:
- Login / register account
- Create / join teams
- Manage roles in team: owner / manager / member
- Manage board access level: viewer only / editor
- Create Personal or Team related boards (aka projects)
- Create cards (aka tasks) and assign them to team members dynamically

## Future Plans - Under Development
Future Plans:
- Using database indexes to speed up queries frequently executed
- Use transactions in functions the require multiple DML statements to be executed
- Create micro-services (message sending, logging) in Java Spring and connect them to ProMan as REST APIs

The following features are under development:
- Dashboard / News Feed
- Team Browser Page for sending requests to join teams
- Message sending feature
- Dashboard / News Feed /Logging: persist all events related to accounts, boards, cards and display on dashboard.
