import type { Process, SchedulingResult, GanttBlock } from '../Types/scheduling';

export function scheduleHRRN(processes: Process[]): SchedulingResult {
  const n = processes.length;
  const ganttChart: GanttBlock[] = [];
  const completed: boolean[] = new Array(n).fill(false);
  const processResults: Process[] = processes.map((p) => ({ ...p }));

  let currentTime = 0;
  let completedCount = 0;

  while (completedCount < n) {
    // collect available processes
    const available: number[] = [];
    for (let i = 0; i < n; i++) {
      if (!completed[i] && processResults[i].arrivalTime <= currentTime) {
        available.push(i);
      }
    }

    if (available.length === 0) {
      // no process available, advance to next arrival
      const nextArrival = Math.min(
        ...processResults
          .map((p, i) => ({ p, i }))
          .filter(({ p, i }) => !completed[i])
          .map(({ p }) => p.arrivalTime)
      );
      currentTime = nextArrival;
      continue;
    }

    // compute response ratio = (waiting + burst) / burst = (currentTime - arrival + burst) / burst
    let bestIdx = available[0];
    let bestRR = -Infinity;

    for (const i of available) {
      const p = processResults[i];
      const waiting = currentTime - p.arrivalTime;
      const rr = (waiting + p.burstTime) / p.burstTime;
      if (rr > bestRR) {
        bestRR = rr;
        bestIdx = i;
      }
    }

    const proc = processResults[bestIdx];
    const startTime = currentTime;
    const endTime = currentTime + proc.burstTime;

    ganttChart.push({ processId: proc.id, startTime, endTime });

    currentTime = endTime;
    proc.completionTime = currentTime;
    proc.turnaroundTime = proc.completionTime - proc.arrivalTime;
    proc.waitingTime = proc.turnaroundTime - proc.burstTime;

    completed[bestIdx] = true;
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
