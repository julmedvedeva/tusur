# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a TUSUR University (Tomsk State University of Control Systems and Radioelectronics) academic coursework repository containing laboratory work for three core computer science courses:

- **Object-Oriented Programming (OOP)** - C++ labs demonstrating inheritance, polymorphism, and operator overloading
- **Databases** - Microsoft Access database design and SQL
- **Operating Systems** - C/POSIX systems programming (process management, signal handling)

**Language Context**: Documentation and variable names are in Russian. Code uses Unicode/wide character support for Cyrillic text (Windows code page 1251).

## Build Commands

### OOP Labs (C++)

All OOP labs use Visual Studio 2022 with the v143 platform toolset.

**Build LAB1 (Inheritance & Polymorphism):**
```bash
cd oop/LAB1
msbuild LAB1.sln /p:Configuration=Debug /p:Platform=x86
# Or for Release:
msbuild LAB1.sln /p:Configuration=Release /p:Platform=x86
```

**Build LAB2 (Operator Overloading):**
```bash
cd oop/LAB2/LAB2
msbuild LAB2.sln /p:Configuration=Debug /p:Platform=x86
```

**Run executables:**
```bash
# LAB1
.\oop\LAB1\Debug\LAB1.exe
# or
.\oop\LAB1\x64\Debug\LAB1.exe

# LAB2
.\oop\LAB2\LAB2\Debug\LAB2.exe
```

**Supported platforms:** Win32 (x86), x64
**Configurations:** Debug, Release

### Operating Systems Labs (C)

**Build generateProcesses (LAB1 - Process Creation):**
```bash
cd operationsystem/generateProcesses
msbuild generateProcesses.sln /p:Configuration=Debug
```

**Build handle_sigusr1 (LAB4 - Signal Handling):**
```bash
cd operationsystem/handle_sigusr
msbuild handle_sigusr.sln /p:Configuration=Debug
```

**Note:** OS labs use POSIX system calls (fork, signal handling) but are built with Visual Studio for Windows compatibility.

### Database Labs

Database labs use Microsoft Access (`.accdb` files) and require Microsoft Access or compatible database tools to open and modify.

**Lab locations:**
- `database/ЛР1/лабораторная 1.accdb`
- `database/ЛР2/лабораторная 2.accdb`
- `database/ЛР3/лабораторная 3.accdb`
- `database/ЛР4/лабораторная 4.accdb`

## Code Architecture

### OOP Lab Structure

**LAB1** - Demonstrates basic OOP concepts:
- Base class `Car` with encapsulation (private members: `brand_`, `number_`, `price_`)
- Derived class `AdditionalCar` with additional field `mainInfo_`
- Virtual destructor pattern
- Polymorphism via virtual `Print()` method override
- Input validation in setter methods
- Wide character support (`wchar_t`, `wstring`) for Russian text

**Key files:**
- `oop/LAB1/LAB1/main.h` - Class declarations
- `oop/LAB1/LAB1/main.cpp` - Implementation (~168 lines)

**LAB2** - Advanced OOP with operator overloading:
- `Car` class with deep copy semantics (copy constructor, copy assignment)
- Type conversion operator: `operator double()` converts Car to price
- Friend function: `operator+()` for adding car prices
- `Group` container class (array-based dynamic collection)
- Operator overloading: `operator[]()` for array-like access
- Statistical methods: `Price()` and `Price(int limit)` for average calculations
- Random data generation using `<random>` library

**Key files:**
- `oop/LAB2/LAB2/car.h` / `car.cpp` - Car class with operators (~76 lines)
- `oop/LAB2/LAB2/group.h` / `group.cpp` - Group container (~74 lines)
- `oop/LAB2/LAB2/main.cpp` - Test harness (~55 lines)

### Operating Systems Lab Structure

**generateProcesses (LAB1)** - Process creation and management:
- Demonstrates `fork()` system call
- Parent-child process relationships
- Process ID tracking

**Key file:** `operationsystem/generateProcesses/main.c` (~80 lines)

**handle_sigusr1 (LAB4)** - Multi-process signal handling:
- Parent creates 3 child processes with different signal handling strategies:
  - **Process 1**: Handles SIGINT with timestamp output, ignores SIGQUIT
  - **Process 2**: Handles SIGINT by continuing execution
  - **Process 3**: Blocks SIGINT using `sigprocmask()`
- Uses `sigaction()` for signal registration
- Demonstrates signal masking and blocking
- Process synchronization with `pause()`

**Key file:** `operationsystem/handle_sigusr/handle_sigusr1.c` (~91 lines)

## Coding Conventions

### Naming Patterns

- **Private members:** Trailing underscore (e.g., `brand_`, `price_`, `number_`)
- **Classes:** PascalCase (Car, Group, AdditionalCar)
- **Methods:** PascalCase (SetBrand, GetPrice, Print)
- **Variables:** Mix of Russian and English, camelCase or snake_case

### Memory Management

- Explicit `new`/`delete` usage
- Array deletion with `delete[]`
- RAII-like patterns with destructors
- Deep copy implementation in copy constructors

### Character Encoding

- Wide character types: `wchar_t`, `wstring`
- Console I/O: `wcin`, `wcout`
- Windows code page 1251 for Cyrillic support
- String literals prefixed with `L` (e.g., `L"Автомобиль"`)

### Error Handling

- Input validation in setter methods
- Stream error checking with `wcin.fail()`
- Null pointer validation where applicable

## Project Organization

```
tusur/
├── oop/                    # Object-oriented programming labs
│   ├── LAB1/              # Inheritance & polymorphism
│   │   ├── LAB1.sln       # Visual Studio solution
│   │   └── LAB1/          # Project directory
│   │       ├── main.h     # Class declarations
│   │       └── main.cpp   # Implementation
│   ├── LAB2/              # Operator overloading
│   │   └── LAB2/
│   │       ├── LAB2.sln
│   │       ├── car.h/cpp
│   │       ├── group.h/cpp
│   │       └── main.cpp
│   └── материалы/         # Course materials (textbooks, references)
├── database/              # Database design labs
│   ├── ЛР1/              # Lab 1: Database fundamentals
│   ├── ЛР2/              # Lab 2: Intermediate concepts
│   ├── ЛР3/              # Lab 3: Advanced queries
│   └── ЛР4/              # Lab 4: Complex operations
└── operationsystem/       # Operating systems labs
    ├── generateProcesses/ # LAB1: Process creation
    └── handle_sigusr/     # LAB4: Signal handling
```

## Documentation Structure

Each lab follows a standard pattern:
- **Source code** - Implementation files (.cpp, .c, .h)
- **Lab reports** - Word documents (`Отчет лабораторная N.docx`)
- **Supporting materials** - PDFs, FAQs, sample data

**Academic attribution:** Student name Медведева Ю.Е. (Medvedeva Yu.E.) appears in lab reports.

## Important Notes

### Visual Studio Configuration

- **Platform Toolset:** v143 (Visual Studio 2022)
- **Character Set:** Unicode
- **Output Type:** Console Application
- **Windows SDK:** Latest installed version
- **C++ Language Standard:** Default (C++14 or later)

### Console Configuration

OOP labs require Windows console setup for Russian text:
```cpp
SetConsoleCP(1251);        // Set input code page
SetConsoleOutputCP(1251);  // Set output code page
```

### Git Ignore Patterns

The repository's `.gitignore` excludes build artifacts but **some `.sln` files are still tracked** (exceptions to the ignore rule). When modifying build configuration:
- Binary files (`.exe`, `.obj`, `.dll`) are ignored
- IDE temporary files (`.vs`, `.user`, `.cache`) are ignored
- Documentation files (`.doc`) are ignored but `.docx` files are tracked
- Solution files may be tracked despite being in `.gitignore`

### Database Access

Microsoft Access databases (`.accdb`) require:
- Microsoft Access 2016 or later, OR
- Microsoft Access Database Engine (redistributable), OR
- Compatible ODBC drivers for programmatic access

## Common Development Workflows

### Adding a new OOP lab

1. Create new directory: `oop/LABN/`
2. Create Visual Studio solution with Console Application template
3. Configure project:
   - Platform Toolset: v143
   - Character Set: Unicode
   - Add Windows console setup code for Russian text
4. Follow naming conventions (trailing underscore for private members)
5. Create corresponding report: `Отчет лабораторная N.docx`

### Testing signal handling (OS labs)

When working with signal handling code:
- Use `kill -SIGINT <pid>` to send signals to processes
- Check process IDs with `ps aux | grep handle_sigusr1`
- Verify signal masks with debugging output
- Remember: POSIX signals may behave differently on Windows vs Linux

### Modifying database schemas

1. Open `.accdb` file in Microsoft Access
2. Make schema changes (tables, relationships, queries)
3. Update corresponding lab report with schema diagrams
4. Export sample data if needed (use `Пациенты.pdf` pattern for reference)
