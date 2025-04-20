#include <stdio.h>

int main() {
    int i, processes = 3;  // Fixed number for testing
    int sum = 0, cnt = 0, y, q = 2;  // Fixed quantum
    int wt = 0, tat = 0;
    int at[10] = {0, 1, 2};  // Pre-defined arrival times
    int bt[10] = {4, 3, 5};  // Pre-defined burst times
    int temp[10];
    float avg_waitt, avg_turnat;

    // Initialize temp array
    for(i = 0; i < processes; i++) {
        temp[i] = bt[i];
    }

    y = processes;

    printf("Process No \tBurst Time \tTAT \t\tWaiting Time\n");
    fflush(stdout);

    // Rest of your scheduling logic remains same
    // ...existing code...

    printf("\nAverage Turnaround Time: %f\n", avg_turnat);
    printf("Average Waiting Time: %f\n", avg_waitt);
    fflush(stdout);
    return 0;
}