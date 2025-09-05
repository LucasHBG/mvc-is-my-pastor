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
├── server/                # Future: Backend server (Node.js/NestJS)
├── .github/               # GitHub workflows and documentation
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Quick Start

### Frontend (Angular)

```bash
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
- **Backend**: Future - NestJS
- **Authentication**: Google OAuth integration
- **Design**: Qonto-inspired dark theme

## Getting Started

1. Clone the repository
2. Navigate to the `client/` directory for frontend development
3. Follow the setup instructions in `client/README.md`

For detailed setup and development instructions, see the README in each respective directory.
