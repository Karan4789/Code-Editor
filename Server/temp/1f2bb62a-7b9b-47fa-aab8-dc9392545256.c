#include <stdio.h>

void main() {
    int i, processes, sum = 0, cnt = 0, y, q, wt = 0, tat = 0, at[10], bt[10], temp[10];
    float avg_waitt, avg_turnat;

    // Input the number of processes
    printf("Total number of processes in the system: ");
    scanf("%d", &processes);

    y = processes;  // Assign number of processes to y

    // Input arrival time and burst time for each process
    for(i = 0; i < processes; i++) {
        printf("\nEnter the Arrival and Burst time of Process[%d]\n", i + 1);
        printf("Arrival time: ");
        scanf("%d", &at[i]);
        printf("Burst time: ");
        scanf("%d", &bt[i]);
        temp[i] = bt[i];  // Initialize remaining burst time
    }

    // Input the time quantum
    printf("Enter the Time Quantum: ");
    scanf("%d", &q);

    // Display header for the process info
    printf("\nProcess No \tBurst Time \tTAT \t\tWaiting Time\n");

    // Scheduling loop
    for(sum = 0, i = 0; y != 0;) {
        if(temp[i] <= q && temp[i] > 0) {
            sum = sum + temp[i];
            temp[i] = 0;
            cnt = 1;
        } else if(temp[i] > 0) {
            temp[i] = temp[i] - q;
            sum = sum + q;
        }

        if(temp[i] == 0 && cnt == 1) {
            y--;  // Decrement remaining processes
            printf("\nProcess No[%d] \t%d \t\t%d \t\t%d", i + 1, bt[i], sum - at[i], sum - at[i] - bt[i]);
            wt = wt + sum - at[i] - bt[i];  // Calculate waiting time
            tat = tat + sum - at[i];  // Calculate turnaround time
            cnt = 0;
        }

        if(i == processes - 1) {
            i = 0;
        } else if(at[i + 1] <= sum) {
            i++;
        } else {
            i = 0;
        }
    }

    // Calculate average waiting time and turnaround time
    avg_waitt = wt * 1.0 / processes;
    avg_turnat = tat * 1.0 / processes;

    printf("\nAverage Turnaround Time: %f", avg_turnat);
    printf("\nAverage Waiting Time: %f", avg_waitt);
}