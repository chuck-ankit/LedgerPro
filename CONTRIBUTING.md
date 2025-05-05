# Contributing to LedgerPro

Thank you for your interest in contributing to LedgerPro! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the Issues section
- Use the bug report template when creating a new issue
- Include detailed steps to reproduce the bug
- Include screenshots if applicable
- Specify your environment (OS, browser, etc.)

### Suggesting Features

- Check if the feature has already been suggested
- Use the feature request template
- Provide a clear description of the feature
- Explain why this feature would be useful
- Include any mockups or examples if applicable

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature/fix
3. Make your changes
4. Write or update tests as needed
5. Ensure all tests pass
6. Update documentation if necessary
7. Submit a pull request

### Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```
3. Set up environment variables
4. Start development servers:
   ```bash
   # Frontend (in frontend directory)
   npm run dev

   # Backend (in backend directory)
   npm run dev
   ```

### Coding Standards

- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Keep functions small and focused
- Add comments for complex logic
- Follow the project's ESLint configuration

### Commit Message Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Example:
```
feat: Add customer search functionality

- Implement search by name, email, and phone
- Add debounce to search input
- Update customer list in real-time
- Add loading state during search

Closes #123
```

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Update tests when fixing bugs
- Maintain good test coverage

### Documentation

- Update README.md if needed
- Document new features
- Update API documentation
- Add comments to complex code

## Getting Help

- Check the documentation
- Search existing issues
- Join our community chat
- Contact the maintainers

## Review Process

1. All PRs will be reviewed by maintainers
2. CI checks must pass
3. Code review feedback must be addressed
4. At least one maintainer must approve
5. PR will be merged after approval

## License

By contributing to LedgerPro, you agree that your contributions will be licensed under the project's MIT License. 