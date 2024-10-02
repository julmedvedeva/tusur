#include <stdio.h>
#include <signal.h>
#include <unistd.h>

// Обработчик сигнала
void handle_sigusr1(int sig) {
    printf("Получен сигнал SIGUSR1!\n");
}

int main() {
    // Регистрация обработчика для SIGUSR1
    if (signal(SIGUSR1, handle_sigusr1) == SIG_ERR) {
        perror("Ошибка регистрации сигнала");
        return 1;
    }

    printf("Ожидание сигнала SIGUSR1... Мой PID: %d\n", getpid());

    // Бесконечный цикл для ожидания сигнала
    while (1) {
        pause(); // Ожидание любого сигнала
    }

    return 0;
}
