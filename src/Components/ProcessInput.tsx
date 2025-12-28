import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Process } from '../Types/scheduling';

interface Props {
  onProcessesChange: (processes: Process[]) => void;
}

export const ProcessInput: React.FC<Props> = ({ onProcessesChange }) => {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 5 },
    { id: 'P2', arrivalTime: 1, burstTime: 3 },
    { id: 'P3', arrivalTime: 2, burstTime: 8 },
  ]);

  const addProcess = () => {
    const newId = `P${processes.length + 1}`;
    const updated = [...processes, { id: newId, arrivalTime: 0, burstTime: 1 }];
    setProcesses(updated);
    onProcessesChange(updated);
  };

  const removeProcess = (index: number) => {
    const updated = processes.filter((_, i) => i !== index);
    setProcesses(updated);
    onProcessesChange(updated);
  };

  const updateProcess = (index: number, field: keyof Process, value: string) => {
    const updated = [...processes];
    if (field === 'id') {
      updated[index][field] = value;
    } else {
      updated[index][field] = parseInt(value) || 0;
    }
    setProcesses(updated);
    onProcessesChange(updated);
  };

  React.useEffect(() => {
    onProcessesChange(processes);
  }, []);

  return (
    <div className='bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md'>
      <h2 className='text-xl font-bold mb-4'>Process Input</h2>

      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-100 dark:bg-gray-700'>
              <th className='border p-2'>Process ID</th>
              <th className='border p-2'>Arrival Time</th>
              <th className='border p-2'>Burst Time</th>
              <th className='border p-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={index}>
                <td className='border p-2'>
                  <input
                    type='text'
                    value={process.id}
                    onChange={(e) => updateProcess(index, 'id', e.target.value)}
                    className='w-full px-2 py-1 rounded border border-gray-300 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600'
                  />
                </td>
                <td className='border p-2'>
                  <input
                    type='number'
                    value={process.arrivalTime}
                    onChange={(e) => updateProcess(index, 'arrivalTime', e.target.value)}
                    className='w-full px-2 py-1 rounded border border-gray-300 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600'
                    min='0'
                  />
                </td>
                <td className='border p-2'>
                  <input
                    type='number'
                    value={process.burstTime}
                    onChange={(e) => updateProcess(index, 'burstTime', e.target.value)}
                    className='w-full px-2 py-1 rounded border border-gray-300 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600'
                    min='1'
                  />
                </td>
                <td className='border p-2 text-center'>
                  <button
                    onClick={() => removeProcess(index)}
                    className='text-red-500 hover:text-red-700'
                    disabled={processes.length === 1}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addProcess}
        className='mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
      >
        <Plus size={18} />
        Add Process
      </button>
    </div>
  );
};
