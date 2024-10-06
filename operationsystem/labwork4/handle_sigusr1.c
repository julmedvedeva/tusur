#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <time.h>
#include <sys/types.h>

void handler_sigint_proc1(int signum) {
    time_t now = time(NULL);
    char *date_time = ctime(&now);
    printf("Процесс 1: Получен сигнал SIGINT. Текущее время: %s", date_time);
}

void handler_sigint_proc2(int signum) {
    printf("Процесс 2: Получен сигнал SIGINT. Продолжаю выполнение...\n");
}

void proc1() {
    struct sigaction sa_int;
    sa_int.sa_handler = handler_sigint_proc1;
    sa_int.sa_flags = 0;
    sigemptyset(&sa_int.sa_mask);
    sigaction(SIGINT, &sa_int, NULL);

    struct sigaction sa_quit;
    sa_quit.sa_handler = SIG_IGN; // Игнорируем SIGQUIT
    sa_quit.sa_flags = 0;
    sigemptyset(&sa_quit.sa_mask);
    sigaction(SIGQUIT, &sa_quit, NULL);

    // Бесконечный цикл, реагирующий на SIGINT
    while (1) {
        pause(); // Ожидаем сигналов
    }
}

void proc2() {
    struct sigaction sa_int;
    sa_int.sa_handler = handler_sigint_proc2;
    sa_int.sa_flags = 0;
    sigemptyset(&sa_int.sa_mask);
    sigaction(SIGINT, &sa_int, NULL);

    // Бесконечный цикл
    while (1) {
        pause(); // Ожидаем сигналов
    }
}

void proc3() {
    sigset_t set;
    sigemptyset(&set);
    sigaddset(&set, SIGINT);
    sigprocmask(SIG_BLOCK, &set, NULL); // Блокируем SIGINT

    // Бесконечный цикл, защищенный от SIGINT
    while (1) {
        pause(); // Ожидаем сигналов
    }
}

int main() {
    pid_t pid;
    puts("Программа создает 3 дочерних процесса и ожидает сигнала SIGINT.");
    // Создаем первый дочерний процесс
    pid = fork();
    if (pid == 0) {
        proc1(); // Дочерний процесс 1
        exit(0);
    }
    printf("Процесс 1 создан, pid 1 = %d\n", pid);

    // Создаем второй дочерний процесс
    pid = fork();
    if (pid == 0) {
        proc2(); // Дочерний процесс 2
        exit(0);
    }
    printf("Процесс 2 создан, pid 2 = %d\n", pid);

    // Создаем третий дочерний процесс
    pid = fork();
    if (pid == 0) {
        proc3(); // Дочерний процесс 3
        exit(0);
    }
    printf("Процесс 3 создан, pid 3 = %d\n", pid);

    // Процесс-отец завершает работу сразу после создания дочерних процессов
    exit(0);
}
