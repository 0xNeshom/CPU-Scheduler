import React, { useState, useEffect } from 'react';
import type { GanttBlock } from '../Types/scheduling';

interface Props {
  ganttChart: GanttBlock[];
  isAnimating: boolean;
  animationSpeed: number;
}

const COLORS = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
  '#6366F1',
  '#84CC16',
];

export const GanttChart: React.FC<Props> = ({ ganttChart, isAnimating, animationSpeed }) => {
  const [visibleBlocks, setVisibleBlocks] = useState<number>(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isAnimating) {
      setVisibleBlocks(ganttChart.length);
      setIsComplete(true);
      return;
    }

    setVisibleBlocks(0);
    setIsComplete(false);

    let currentBlock = 0;
    const interval = setInterval(() => {
      currentBlock++;
      setVisibleBlocks(currentBlock);

      if (currentBlock >= ganttChart.length) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, animationSpeed);

    return () => clearInterval(interval);
  }, [ganttChart, isAnimating, animationSpeed]);

  if (ganttChart.length === 0) {
    return (
      <div className='bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md'>
        <h2 className='text-xl font-bold mb-4'>Gantt Chart</h2>
        <p className='text-gray-500 dark:text-gray-400'>Run simulation to see Gantt Chart</p>
      </div>
    );
  }

  const maxTime = Math.max(...ganttChart.map((b) => b.endTime));
  const displayBlocks = ganttChart.slice(0, visibleBlocks);

  const getColor = (processId: string) => {
    const uniqueIds = [...new Set(ganttChart.map((b) => b.processId))];
    const index = uniqueIds.indexOf(processId);
    return COLORS[index % COLORS.length];
  };

  return (
    <div className='bg-white dark:bg-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-md'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Gantt Chart</h2>
        {isAnimating && !isComplete && <span className='text-sm text-blue-600 animate-pulse'>Animating...</span>}
      </div>

      <div className='relative'>
        {/* Gantt blocks */}
        <div className='flex border-b-2 border-gray-300'>
          {displayBlocks.map((block, index) => {
            const width = ((block.endTime - block.startTime) / maxTime) * 100;
            return (
              <div
                key={index}
                className='relative border border-gray-300 flex items-center justify-center transition-all duration-300'
                style={{
                  width: `${width}%`,
                  minWidth: '60px',
                  height: '60px',
                  backgroundColor: getColor(block.processId),
                  animation: isAnimating ? 'slideIn 0.3s ease-out' : 'none',
                }}
              >
                <span className='text-white font-semibold'>{block.processId}</span>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className='flex mt-1'>
          {displayBlocks.map((block, index) => {
            const width = ((block.endTime - block.startTime) / maxTime) * 100;
            return (
              <div key={index} className='relative text-xs' style={{ width: `${width}%`, minWidth: '60px' }}>
                <span className='absolute left-0'>{block.startTime}</span>
                {index === displayBlocks.length - 1 && <span className='absolute right-0'>{block.endTime}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: scaleX(0);
            opacity: 0;
          }
          to {
            transform: scaleX(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
