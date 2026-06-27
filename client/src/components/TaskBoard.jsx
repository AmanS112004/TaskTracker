import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks.js";
import TaskCard from "./TaskCard.jsx";
import EmptyState from "./EmptyState.jsx";

const BoardColumn = ({ title, status, tasks, onDragOver, onDrop, gridSpan }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 26 } }
      }}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
      data-column-status={status}
      className={`${gridSpan} flex flex-col gap-4 bg-[var(--color-surface)]/45 border border-black/5 rounded-3xl p-5 min-h-[500px] transition-colors`}
    >
      <div className="flex justify-between items-center pb-2.5 border-b border-black/5">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text)] flex items-center gap-2">
          {title}
          <span className="text-[9px] font-mono px-2 py-0.5 bg-[var(--color-hover)] border border-[var(--color-text)]/10 rounded-full text-[var(--color-text)] font-bold">
            {tasks.length}
          </span>
        </h3>
      </div>

      <div className="flex-1 flex flex-col gap-3.5 overflow-y-auto pt-1.5 pb-2 pr-1.5 pl-0.5">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-black/15 rounded-2xl min-h-[140px] text-[9px] uppercase font-black tracking-widest text-[#23354C]/85">
            Drop tasks here
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TaskBoard = () => {
  const { tasks, updateExistingTask, setActiveTask, setIsDrawerOpen } = useTasks();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, status) => {
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;
    await updateExistingTask(taskId, { status });
  };

  const handleCreateTask = () => {
    setActiveTask({ isNew: true });
    setIsDrawerOpen(true);
  };

  if (tasks.length === 0) {
    return <EmptyState onCreateClick={handleCreateTask} />;
  }

  const todoTasks = tasks.filter((t) => t.status === "Todo");
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress");
  const completedTasks = tasks.filter((t) => t.status === "Completed");

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.12 } }
      }}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      <BoardColumn
        title="Todo"
        status="Todo"
        tasks={todoTasks}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        gridSpan="lg:col-span-5"
      />
      <BoardColumn
        title="In Progress"
        status="In Progress"
        tasks={inProgressTasks}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        gridSpan="lg:col-span-4"
      />
      <BoardColumn
        title="Completed"
        status="Completed"
        tasks={completedTasks}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        gridSpan="lg:col-span-3"
      />
    </motion.div>
  );
};

export default TaskBoard;
