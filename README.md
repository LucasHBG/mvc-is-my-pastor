# MVC is My Pastor - Monorepo

A full-stack financial management application inspired by Qonto's design and functionality.

## Project Structure

```
mvc-is-my-pastor/
├── client/                 # Angular frontend application
│   ├── src/               # Angular source code
│   ├── package.json       # Frontend dependencies
│   ├── angular.json       # Angular configuration
│   └── README.md          # Frontend documentation
├── database/              # MySQL database configuration
│   ├── init/              # Database initialization scripts
│   └── README.md          # Database documentation
├── server/                # Future: Backend server (Node.js/NestJS)
├── .github/               # GitHub workflows and documentation
├── docker-compose.yml     # Database services
├── .env.template          # Environment variables template
├── setup-database.sh      # Database setup script
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Quick Start

### Full Stack Setup

```bash
# 1. Set up database
./setup-database.sh

# 2. Set up frontend
cd client
make install    # Install dependencies
make setup-env  # Set up environment files
make dev        # Start development server
```

### Development Workflow

1. **Frontend development**: Work in the `client/` directory
2. **Backend development**: Future - will be in `server/` directory
3. **Documentation**: Check individual README files in each directory

## Technologies

- **Frontend**: Angular 17, SCSS, TypeScript
- **Database**: MySQL 8.0 with Docker
- **Backend**: Future - NestJS
- **Authentication**: Google OAuth integration
- **Design**: Banking inspired dark theme

## Services

- **Frontend**: http://localhost:4200 (Angular dev server)
- **Database**: localhost:3306 (MySQL)
- **phpMyAdmin**: http://localhost:8080 (Database web interface)

For detailed setup and development instructions, see the README in each respective directory.
