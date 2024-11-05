#include <stdio.h>
#include <windows.h>
#include <time.h>
#include <signal.h>

// ���������� ������� SIGINT
void handle_sigint(int sig) {
    DWORD pid = GetCurrentProcessId();
    printf("������� ������ SIGINT � �������� � PID %u\n", pid);
    while (1) {
        printf("��������� � ����������� ����� � �������� � PID %u\n", pid);
        SYSTEMTIME st;
        GetLocalTime(&st);
        printf("������� ���� � �����: %02u:%02u:%02u\n", st.wHour, st.wMinute, st.wSecond);
    }
}

// ���������� ������� SIGQUIT
void handle_sigquit(int sig) {
    DWORD pid = GetCurrentProcessId();
    printf("������� ������ SIGQUIT � �������� � PID %u\n", pid);
}

int main() {
    int i;
    DWORD pid;

    // ����������� ������������ ��������
    struct sigaction sa;
    sa.sa_handler = handle_sigint;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;
    sigaction(SIGINT, &sa, NULL);

    sa.sa_handler = handle_sigquit;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;
    sigaction(SIGQUIT, &sa, NULL);

    // ���������� �������� ���������
    for (i = 0; i < 3; i++) {
        pid = GetCurrentProcessId();
        if (0 != _beginthread(child_process, 0, (void*)i)) {
            perror("������ ���������� ��������");
            return 1;
        }
    }

    // �������-���� �����������
    pid = GetCurrentProcessId();
    printf("�������-���� � PID %u �������� ���� ����������\n", pid);
    return 0;
}

void child_process(void* arg) {
    int i = (int)arg;
    DWORD pid = GetCurrentProcessId();

    if (i == 0) {
        // ������ �������� �������
        printf("������ �������� ������� � PID %u\n", pid);
        while (1) {
            Sleep(INFINITE); // �������� ������� SIGINT
        }
    }
    else if (i == 1) {
        // ������ �������� �������
        printf("������ �������� ������� � PID %u\n", pid);
        while (1) {
            printf("��������� � ����������� ����� � �������� � PID %u\n", pid);
            Sleep(1000);
        }
    }
    else {
        // ������ �������� �������
        printf("������ �������� ������� � PID %u\n", pid);
        while (1) {
            Sleep(1000);
        }
    }
}