import React, {useState, DragEvent} from 'react';
import {PlannerConfigType, PlannerType, TaskDataType} from '@/types';
import {Board, Task} from '@/components';
import {alternativeMockData, plannerStructure} from './planner.constants';

import './Planner.scss';

export const Planner = () => {
  const [config, setConfig] = useState<PlannerConfigType>(alternativeMockData);
  const [currentTask, setCurrentTask] = useState<TaskDataType | null>(null);
  const [isDragOverTask, setIsDragOverTask] = useState<boolean>(false);

  const configuratedData = plannerStructure.map((item) => ({...item, tasks: config[item.id]}));

  const handleDragStart = (data: TaskDataType) => (_: DragEvent<HTMLDivElement>) => {
    setCurrentTask(data);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragOverTask(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragOverTask(true);
  };

  console.log(config);

  const handleDrop = (data: TaskDataType) => (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setIsDragOverTask(false);

    if (currentTask) {
      if (currentTask.type !== data.type) {
        const currentBoard = [...config[currentTask.type]];
        const board = [...config[data.type]];

        const currentIndex = currentBoard.findIndex((item) => item.id === currentTask.id);
        currentBoard.splice(currentIndex, 1);

        const dropIndex = board.findIndex((item) => item.id === data.id);
        board.splice(dropIndex + 1, 0, {...currentTask, type: data.type});

        setConfig((current) => ({
          ...current,
          [data.type]: board,
          [currentTask.type]: currentBoard,
        }));
      } else {
        const board = [...config[data.type]];

        const currentIndex = board.findIndex((item) => item.id === currentTask.id);
        board.splice(currentIndex, 1);

        const dropIndex = board.findIndex((item) => item.id === data.id);
        board.splice(dropIndex + 1, 0, currentTask);

        setConfig((current) => ({
          ...current,
          [data.type]: board,
        }));
      }
    }
  };

  const handleBoardDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleBoardDrop = (data: PlannerType) => (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!isDragOverTask && currentTask) {
      if (currentTask.type !== data.id) {
        const currentBoard = [...config[currentTask.type]];
        const board = [...data.tasks];

        const currentIndex = currentBoard.findIndex((item) => item.id === currentTask.id);
        currentBoard.splice(currentIndex, 1);

        board.push({...currentTask, type: data.id});

        setConfig((current) => ({
          ...current,
          [currentTask.type]: currentBoard,
          [data.id]: board,
        }));
      } else {
        const board = [...config[data.id]];

        const currentIndex = board.findIndex((item) => item.id === currentTask.id);
        board.splice(currentIndex, 1);

        board.push({...currentTask, type: data.id});

        setConfig((current) => ({
          ...current,
          [data.id]: board,
        }));
      }
    }
  };

  return (
    <div className="planner__container">
      {configuratedData.map((board) => {
        return (
          <Board
            key={board.id}
            label={board.label}
            onDrop={handleBoardDrop(board)}
            onDragOver={handleBoardDragOver}
          >
            {board.tasks.map((task) => (
              <Task
                key={task.id}
                content={task.content}
                onDragStart={handleDragStart(task)}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop(task)}
              />
            ))}
          </Board>
        );
      })}
    </div>
  );
};
