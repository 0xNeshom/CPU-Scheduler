import React from 'react';
import type { GanttBlock } from '../Types/scheduling';

interface Props {
  ganttChart: GanttBlock[];
}

export const ExecutionLog: React.FC<Props> = ({ ganttChart }) => {
  if (!ganttChart || ganttChart.length === 0) {
    return (
      <div className='bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md mt-6'>
        <h2 className='text-xl font-bold mb-2'>Execution Log</h2>
        <p className='text-gray-600 dark:text-gray-400'>No execution records yet. Run a simulation to see records.</p>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md mt-6'>
      <h2 className='text-xl font-bold mb-4'>Execution Log</h2>
      <div className='overflow-x-auto'>
        <table className='w-full table-auto border-collapse'>
          <thead>
            <tr className='bg-gray-100 dark:bg-gray-700'>
              <th className='border p-2 text-left'>#</th>
              <th className='border p-2 text-left'>Process</th>
              <th className='border p-2 text-left'>Start</th>
              <th className='border p-2 text-left'>End</th>
              <th className='border p-2 text-left'>Duration</th>
            </tr>
          </thead>
          <tbody>
            {ganttChart.map((b, i) => (
              <tr key={i} className='odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700'>
                <td className='border p-2'>{i + 1}</td>
                <td className='border p-2 font-semibold'>{b.processId}</td>
                <td className='border p-2'>{b.startTime}</td>
                <td className='border p-2'>{b.endTime}</td>
                <td className='border p-2'>{b.endTime - b.startTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExecutionLog;
