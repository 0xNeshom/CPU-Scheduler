import type { Process, SchedulingResult, GanttBlock } from '../Types/scheduling';

export function scheduleRoundRobin(processes: Process[], quantum: number): SchedulingResult {
  const n = processes.length;
  const ganttChart: GanttBlock[] = [];
  const processResults: Process[] = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime,
  }));

  const queue: number[] = [];
  let currentTime = 0;
  let completed = 0;
  const inQueue = new Array(n).fill(false);

  // Add processes that arrive at time 0
  for (let i = 0; i < n; i++) {
    if (processResults[i].arrivalTime === 0) {
      queue.push(i);
      inQueue[i] = true;
    }
  }

  while (completed < n) {
    if (queue.length === 0) {
      // No process in queue, jump to next arrival
      const nextArrival = Math.min(
        ...processResults
          .filter((p) => (p.remainingTime || 0) > 0)
          .map((p) => p.arrivalTime)
          .filter((at) => at > currentTime)
      );
      currentTime = nextArrival;

      // Add newly arrived processes
      for (let i = 0; i < n; i++) {
        if (!inQueue[i] && processResults[i].arrivalTime <= currentTime && (processResults[i].remainingTime || 0) > 0) {
          queue.push(i);
          inQueue[i] = true;
        }
      }
      continue;
    }

    const idx = queue.shift()!;
    inQueue[idx] = false;
    const process = processResults[idx];

    const execTime = Math.min(quantum, process.remainingTime || 0);
    const startTime = currentTime;
    const endTime = currentTime + execTime;

    ganttChart.push({
      processId: process.id,
      startTime,
      endTime,
    });

    currentTime = endTime;
    process.remainingTime = (process.remainingTime || 0) - execTime;

    // Add newly arrived processes to queue
    for (let i = 0; i < n; i++) {
      if (
        !inQueue[i] &&
        processResults[i].arrivalTime <= currentTime &&
        processResults[i].arrivalTime > startTime &&
        (processResults[i].remainingTime || 0) > 0
      ) {
        queue.push(i);
        inQueue[i] = true;
      }
    }

    // If process not finished, add back to queue
    if ((process.remainingTime || 0) > 0) {
      queue.push(idx);
      inQueue[idx] = true;
    } else {
      process.completionTime = currentTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;
      completed++;
    }
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
