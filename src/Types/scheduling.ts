export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  remainingTime?: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
}

export interface GanttBlock {
  processId: string;
  startTime: number;
  endTime: number;
}

export interface SchedulingResult {
  ganttChart: GanttBlock[];
  processes: Process[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
}

export type AlgorithmType = 'SJF' | 'RR' | 'HRRN';
