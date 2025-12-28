import React from 'react';
import type { Process } from '../Types/scheduling';

interface Props {
  processes: Process[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
}

export const MetricsTable: React.FC<Props> = ({ processes, averageWaitingTime, averageTurnaroundTime }) => {
  if (processes.length === 0 || processes[0].completionTime === undefined) {
    return null;
  }

  return (
    <div className='bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md'>
      <h2 className='text-xl font-bold mb-4'>Scheduling Metrics</h2>

      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-100 dark:bg-gray-700'>
              <th className='border p-2'>Process</th>
              <th className='border p-2'>AT</th>
              <th className='border p-2'>BT</th>
              <th className='border p-2'>CT</th>
              <th className='border p-2'>TAT</th>
              <th className='border p-2'>WT</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process) => (
              <tr key={process.id}>
                <td className='border p-2 text-center font-semibold'>{process.id}</td>
                <td className='border p-2 text-center'>{process.arrivalTime}</td>
                <td className='border p-2 text-center'>{process.burstTime}</td>
                <td className='border p-2 text-center'>{process.completionTime}</td>
                <td className='border p-2 text-center'>{process.turnaroundTime}</td>
                <td className='border p-2 text-center'>{process.waitingTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-4 p-4 bg-blue-50 dark:bg-gray-700 dark:text-gray-100 rounded'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-300'>Average Waiting Time</p>
            <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{averageWaitingTime.toFixed(2)}</p>
          </div>
          <div>
            <p className='text-sm text-gray-600 dark:text-gray-300'>Average Turnaround Time</p>
            <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{averageTurnaroundTime.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className='mt-4 text-xs text-gray-500 dark:text-gray-400'>
        <p>AT = Arrival Time | BT = Burst Time | CT = Completion Time</p>
        <p>TAT = Turnaround Time | WT = Waiting Time</p>
      </div>
    </div>
  );
};
