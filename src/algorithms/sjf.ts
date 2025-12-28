import type { Process, SchedulingResult, GanttBlock } from '../Types/scheduling';

export function scheduleSJF(processes: Process[]): SchedulingResult {
  const n = processes.length;
  const ganttChart: GanttBlock[] = [];
  const completed: boolean[] = new Array(n).fill(false);
  const processResults: Process[] = processes.map((p) => ({ ...p }));

  let currentTime = 0;
  let completedCount = 0;

  while (completedCount < n) {
    // Find available processes
    let minIdx = -1;
    let minBurst = Infinity;

    for (let i = 0; i < n; i++) {
      if (!completed[i] && processResults[i].arrivalTime <= currentTime) {
        if (processResults[i].burstTime < minBurst) {
          minBurst = processResults[i].burstTime;
          minIdx = i;
        }
      }
    }

    if (minIdx === -1) {
      // No process available, CPU idle - jump to next arrival
      const nextArrival = Math.min(...processResults.filter((_, i) => !completed[i]).map((p) => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }

    // Execute selected process
    const process = processResults[minIdx];
    const startTime = currentTime;
    const endTime = currentTime + process.burstTime;

    ganttChart.push({
      processId: process.id,
      startTime,
      endTime,
    });

    currentTime = endTime;
    process.completionTime = currentTime;
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;

    completed[minIdx] = true;
    completedCount++;
  }

  const totalWT = processResults.reduce((sum, p) => sum + (p.waitingTime || 0), 0);
  const totalTAT = processResults.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);

  return {
    ganttChart,
    processes: processResults,
    averageWaitingTime: totalWT / n,
    averageTurnaroundTime: totalTAT / n,
  };
}
