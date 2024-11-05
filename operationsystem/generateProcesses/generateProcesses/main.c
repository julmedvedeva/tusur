#include <stdio.h>
#include <windows.h>
#include <time.h>
#include <signal.h>

// Обработчик сигнала SIGINT
void handle_sigint(int sig) {
    DWORD pid = GetCurrentProcessId();
    printf("Получен сигнал SIGINT в процессе с PID %u\n", pid);
    while (1) {
        printf("Сообщение в бесконечном цикле в процессе с PID %u\n", pid);
        SYSTEMTIME st;
        GetLocalTime(&st);
        printf("Текущая дата и время: %02u:%02u:%02u\n", st.wHour, st.wMinute, st.wSecond);
    }
}

// Обработчик сигнала SIGQUIT
void handle_sigquit(int sig) {
    DWORD pid = GetCurrentProcessId();
    printf("Получен сигнал SIGQUIT в процессе с PID %u\n", pid);
}

int main() {
    int i;
    DWORD pid;

    // Регистрация обработчиков сигналов
    struct sigaction sa;
    sa.sa_handler = handle_sigint;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;
    sigaction(SIGINT, &sa, NULL);

    sa.sa_handler = handle_sigquit;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;
    sigaction(SIGQUIT, &sa, NULL);

    // Порождение дочерних процессов
    for (i = 0; i < 3; i++) {
        pid = GetCurrentProcessId();
        if (0 != _beginthread(child_process, 0, (void*)i)) {
            perror("Ошибка порождения процесса");
            return 1;
        }
    }

    // Процесс-отец завершается
    pid = GetCurrentProcessId();
    printf("Процесс-отец с PID %u завершил свое выполнение\n", pid);
    return 0;
}

void child_process(void* arg) {
    int i = (int)arg;
    DWORD pid = GetCurrentProcessId();

    if (i == 0) {
        // Первый дочерний процесс
        printf("Первый дочерний процесс с PID %u\n", pid);
        while (1) {
            Sleep(INFINITE); // Ожидание сигнала SIGINT
        }
    }
    else if (i == 1) {
        // Второй дочерний процесс
        printf("Второй дочерний процесс с PID %u\n", pid);
        while (1) {
            printf("Сообщение в бесконечном цикле в процессе с PID %u\n", pid);
            Sleep(1000);
        }
    }
    else {
        // Третий дочерний процесс
        printf("Третий дочерний процесс с PID %u\n", pid);
        while (1) {
            Sleep(1000);
        }
    }
}