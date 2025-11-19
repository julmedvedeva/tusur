# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a university coursework repository (TUSUR) containing lab work and assignments for multiple computer science courses, organized by subject area. The repository uses mixed languages (Russian for documentation and comments, English for some code).

## Directory Structure

- `oop/` - Object-Oriented Programming labs (C++)
  - `LAB1/`, `LAB2/` - Lab assignments with complete implementations
  - `labwork1/` - Additional lab work
  - Review documents and methodological materials included

- `operationsystem/` - Operating Systems labs (C)
  - Signal handling implementations (SIGINT, SIGQUIT)
  - Process management and fork() demonstrations
  - `labwork4/` contains signal handler implementations
  - `generateProcesses/` - utility for process generation

- `database/` - Database course labs (Microsoft Access)
  - `ЛР1/` through `ЛР4/` - Lab reports with .accdb database files
  - Each lab includes Word reports (.docx) and Access databases

- `data-base-mc-access/` - Additional database materials
  - Contains cars.accdb and medical clinic database
  - Lab reports and screenshots

- `programming/` - Programming basics
  - `pascal/` - Pascal language assignments
  - JavaScript utilities

- Other subject directories (not actively developed):
  - `informatics/`, `structure-and-algorimtics/`
  - `дискретка/`, `математика/`, `контрольные/`, etc.

## Development Environment

### C++ (OOP Labs)

**Platform**: Windows-specific (uses Windows.h, console code pages)

**Compilation**: Visual Studio project files present
- `.sln`, `.vcxproj` files in operationsystem/
- Windows console codepage handling (chcp 1251, SetConsoleOutputCP(866))

**Character encoding**:
- Wide character strings (wchar_t, wstring) used in LAB1
- Regular char* in LAB2
- UTF-8 and Windows-1251 encoding switching required

**Key patterns**:
- Class-based design with constructors, destructors, copy constructors
- Operator overloading (type conversion, arithmetic operators)
- Input validation with error handling
- Dynamic and static memory allocation demonstrations

### C (OS Labs)

**Platform**: Unix/Linux (POSIX signals, fork, pause)

**Compilation**: Standard GCC
```bash
gcc -o handle_sigusr1 operationsystem/labwork4/handle_sigusr1.c
```

**Key concepts demonstrated**:
- Signal handling with sigaction()
- Process creation with fork()
- Signal masking and blocking
- Multiple process coordination

### Database Labs

**Platform**: Microsoft Access (.accdb format)
- No command-line build process
- Open .accdb files directly in Microsoft Access

### Pascal Programming

**Compilation**: Free Pascal Compiler (likely)
```bash
fpc programming/pascal/filename.pas
```

## Working with Code

### Character Encoding Issues

**Windows C++ projects** require specific console setup:
```cpp
#ifdef _WIN32
    system("chcp 1251 > nul");
#endif
setlocale(LC_ALL, "Russian");
SetConsoleOutputCP(866);
```

**When editing C++ files**: Preserve the encoding declarations and wide character usage patterns.

### Git Workflow

The repository tracks lab work submissions. Check `.gitignore` for excluded patterns:
- Build artifacts (*.exe, *.obj, *.o, Debug/, Release/)
- IDE files (.vscode/, .idea/, *.user)
- Compiled outputs (bin/)
- Documentation files (*.doc - note that some .docx files ARE tracked)

### Testing and Running

**OOP Labs (C++)**:
- Compile with Visual Studio or compatible Windows C++ compiler
- Interactive console programs - test all menu options
- Verify destructor calls in output

**OS Labs (C)**:
- Compile on Unix/Linux system
- Test signal handling with `kill -SIGINT <pid>`
- Verify process creation and signal propagation

**Database Labs**:
- Open in Microsoft Access
- No automated testing - manual verification of queries and forms

## MCP Integration

This repository is configured to use **Context7 MCP** for enhanced code context and navigation.

### Context7 MCP Setup

Context7 provides semantic code understanding across the repository. When working with code:

- **IMPORTANT: Always query Context7 MCP FIRST** when handling any request that involves understanding, searching, or navigating code in this repository
- Use Context7 to understand relationships between classes and functions across different lab assignments
- Leverage semantic search to find similar implementations across different subjects
- Get better context when working with multi-file projects (e.g., OOP LAB2 with separate header and implementation files)

### Recommended MCP Usage

**For OOP labs**: Use Context7 to understand class hierarchies and inheritance patterns (e.g., Car → AdditionalCar in LAB1)

**For OS labs**: Query Context7 to find signal handling patterns and process management examples across different lab works

**For cross-subject work**: Context7 can help identify similar algorithmic patterns between Pascal, C, and C++ implementations

## Important Notes

- **Language**: Comments and variable names mix Russian and English
- **Platform dependencies**: OOP labs are Windows-specific, OS labs are Unix/Linux
- **Reports**: Lab reports (.docx) document implementation and results
- **Review files**: "Рецензия" documents contain instructor feedback
- **Methodological materials**: PDF files contain assignment descriptions and requirements