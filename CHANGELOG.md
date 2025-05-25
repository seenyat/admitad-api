# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-12-XX

### Fixed
- **ES Module Import Issue**: Fixed missing `.js` extensions in compiled JavaScript files that caused `ERR_MODULE_NOT_FOUND` errors when using the package in ES module projects
- Added automatic import fixing script that runs after TypeScript compilation
- Updated build process to ensure proper ES module compatibility

### Added
- `scripts/fix-imports.js` - Automatic script to add `.js` extensions to relative imports
- `fix-imports` npm script for manual import fixing
- Enhanced build process with automatic import fixing

### Technical Details
- The issue occurred because TypeScript was compiling imports without `.js` extensions
- ES modules require explicit file extensions for relative imports
- Added post-build script that automatically adds `.js` extensions to all relative imports in compiled files

## [1.0.0] - 2024-12-XX

### Added
- Initial release of Admitad API client
- OAuth2 client credentials authentication
- Automatic token management and expiration handling
- Support for all Admitad API endpoints
- AliExpress commission rates API support
- Full TypeScript support with type definitions
- Environment variable configuration
- Factory functions for easy setup
- Comprehensive error handling
- Complete documentation and examples 