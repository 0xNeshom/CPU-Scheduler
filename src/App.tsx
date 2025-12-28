import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Sun, Moon } from 'lucide-react';
import { GanttChart } from './Components/GanttChart';
import { scheduleSJF } from './algorithms/sjf';
import { scheduleRoundRobin } from './algorithms/rpundRobin';
import { MetricsTable } from './Components/MetricsTable';
import { ProcessInput } from './Components/ProcessInput';
import ExecutionLog from './Components/ExecutionLog';
import type { Process, AlgorithmType, SchedulingResult } from './Types/scheduling';
import { scheduleHRRN } from './algorithms/hrrn';

export default function App() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (dark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch (e) {
      // ignore
    }
  }, [dark]);

  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 5 },
    { id: 'P2', arrivalTime: 1, burstTime: 3 },
    { id: 'P3', arrivalTime: 2, burstTime: 8 },
    { id: 'P4', arrivalTime: 3, burstTime: 6 },
  ]);

  const [algorithm, setAlgorithm] = useState<AlgorithmType>('SJF');
  const [quantum, setQuantum] = useState(2);
  const [result, setResult] = useState<SchedulingResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);

  const handleProcessesChange = (newProcesses: Process[]) => {
    setProcesses(newProcesses);
    setResult(null); // Clear results when processes change
  };

  const runSimulation = () => {
    if (processes.length === 0) {
      alert('Please add at least one process');
      return;
    }

    // Validate processes
    const hasInvalidProcess = processes.some((p) => p.burstTime <= 0 || p.arrivalTime < 0);

    if (hasInvalidProcess) {
      alert('All processes must have positive burst time and non-negative arrival time');
      return;
    }

    setIsAnimating(true);

    let schedulingResult;
    if (algorithm === 'SJF') schedulingResult = scheduleSJF(processes);
    else if (algorithm === 'RR') schedulingResult = scheduleRoundRobin(processes, quantum);
    else schedulingResult = scheduleHRRN(processes);

    setResult(schedulingResult);
  };

  const reset = () => {
    setResult(null);
    setIsAnimating(false);
  };

  return (
    <div className='min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-4xl font-bold text-indigo-900 dark:text-indigo-200 mb-2'>CPU Scheduling Simulator</h1>
            <p className='text-gray-600 dark:text-gray-300'>
              Visualize SJF and Round Robin scheduling algorithms with animated Gantt Charts
            </p>
          </div>
          <div>
            <button
              onClick={() => setDark((d) => !d)}
              aria-label='Toggle dark mode'
              className='p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm'
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Control Panel */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          {/* Algorithm Selection */}
          <div className='bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-4'>Algorithm</h2>
            <select
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value as AlgorithmType);
                setResult(null);
              }}
              className='w-full p-2 mb-4 rounded border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600'
            >
              <option value='SJF'>Shortest Job First (Non-Preemptive)</option>
              <option value='RR'>Round Robin (Preemptive)</option>
              <option value='HRRN'>Highest Response Ratio Next (HRRN)</option>
            </select>

            {algorithm === 'RR' && (
              <div>
                <label className='block text-sm font-medium mb-2 dark:text-gray-300'>Time Quantum</label>
                <input
                  type='number'
                  value={quantum}
                  onChange={(e) => setQuantum(parseInt(e.target.value) || 1)}
                  className='w-full p-2 rounded border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600'
                  min='1'
                />
              </div>
            )}
          </div>

          {/* Animation Speed Control */}
          <div className='bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-4'>Animation Speed</h2>
            <input
              type='range'
              min='100'
              max='1000'
              step='100'
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
              className='w-full accent-blue-500'
            />
            <div className='flex justify-between text-xs text-gray-600 mt-2'>
              <span>Fast (100ms)</span>
              <span className='font-semibold'>{animationSpeed}ms</span>
              <span>Slow (1000ms)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md flex items-center justify-center gap-4'>
            <button
              onClick={runSimulation}
              className='flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-md hover:shadow-lg'
            >
              <Play size={20} />
              Run Simulation
            </button>
            <button
              onClick={reset}
              className='flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold shadow-md hover:shadow-lg'
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
        </div>

        {/* Process Input Section */}
        <div className='mb-6'>
          <ProcessInput onProcessesChange={handleProcessesChange} />
        </div>

        {/* Results Section */}
        {result && (
          <>
            {/* Gantt Chart */}
            <div className='mb-6'>
              <GanttChart ganttChart={result.ganttChart} isAnimating={isAnimating} animationSpeed={animationSpeed} />
            </div>

            {/* Metrics Table */}
            <div className='mb-6'>
              <MetricsTable
                processes={result.processes}
                averageWaitingTime={result.averageWaitingTime}
                averageTurnaroundTime={result.averageTurnaroundTime}
              />
            </div>
          </>
        )}

        {/* Algorithm Info */}
        {!result && (
          <div className='bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-4'>
              {algorithm === 'SJF'
                ? 'Shortest Job First (SJF)'
                : algorithm === 'RR'
                ? 'Round Robin (RR)'
                : 'Highest Response Ratio Next (HRRN)'}
            </h2>
            {algorithm === 'SJF' ? (
              <div className='text-gray-700 dark:text-gray-300'>
                <p className='mb-2'>
                  <strong>Non-Preemptive:</strong> At any given time, the CPU selects the available process with the
                  smallest burst time.
                </p>
                <p className='mb-2'>Once a process starts execution, it runs to completion without interruption.</p>
                <p className='text-sm text-gray-600'>
                  ✓ Optimizes average waiting time
                  <br />✗ Can cause starvation for long processes
                </p>
              </div>
            ) : algorithm === 'RR' ? (
              <div className='text-gray-700 dark:text-gray-300'>
                <p className='mb-2'>
                  <strong>Preemptive:</strong> Each process is given a fixed time quantum. If the process finishes
                  within the quantum, it exits.
                </p>
                <p className='mb-2'>If not, it is preempted and placed at the end of the ready queue.</p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  ✓ Fair scheduling and prevents starvation
                  <br />✓ Resembles real OS schedulers
                </p>
              </div>
            ) : (
              <div className='text-gray-700 dark:text-gray-300'>
                <p className='mb-2'>
                  <strong>HRRN:</strong> The Highest Response Ratio Next (HRRN) algorithm selects the process with the
                  highest response ratio (waiting + burst) / burst.
                </p>
                <p className='mb-2'>It balances waiting time and burst time to improve overall turnaround.</p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  ✓ Balances turnaround time and waiting time
                  <br />✗ Can favor longer jobs if waiting time grows
                </p>
              </div>
            )}
          </div>
        )}
        {/* Execution Log (shows every gantt record) */}
        <ExecutionLog ganttChart={result ? result.ganttChart : []} />
      </div>
    </div>
  );
}
