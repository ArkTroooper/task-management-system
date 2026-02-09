import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import CreateTaskModal from '../modals/CreateTaskModal';
import EditTaskModal from '../modals/EditTaskModal';
import { TaskContext } from '../../context/TaskContext';
import { useSocket } from '../../hooks/useSocket';
import { COLUMNS, TASK_STATUS } from '../../utils/constants';
import Loader from '../common/Loader';

const KanbanBoard = ({ projectId }) => {
  const { tasks, loading, fetchTasks, moveTask } = useContext(TaskContext);
  const { subscribe, unsubscribe, joinRoom, leaveRoom } = useSocket();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
      joinRoom(`project_${projectId}`);
    }

    return () => {
      if (projectId) {
        leaveRoom(`project_${projectId}`);
      }
    };
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Subscribe to real-time updates
  useEffect(() => {
    const handleTaskUpdate = () => {
      if (projectId) {
        fetchTasks(projectId);
      }
    };

    subscribe('task_created', handleTaskUpdate);
    subscribe('task_updated', handleTaskUpdate);
    subscribe('task_deleted', handleTaskUpdate);
    subscribe('task_moved', handleTaskUpdate);

    return () => {
      unsubscribe('task_created', handleTaskUpdate);
      unsubscribe('task_updated', handleTaskUpdate);
      unsubscribe('task_deleted', handleTaskUpdate);
      unsubscribe('task_moved', handleTaskUpdate);
    };
  }, [projectId, subscribe, unsubscribe, fetchTasks]);

  // Handle drag end
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside
    if (!destination) return;

    // Dropped in same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      await moveTask(draggableId, destination.droppableId, destination.index);
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  // Handle add task
  const handleAddTask = (columnId) => {
    setSelectedColumn(columnId);
    setShowCreateModal(true);
  };

  // Handle task click
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  // Group tasks by status
  const groupedTasks = {
    [TASK_STATUS.TODO]: tasks.filter((t) => t.status === TASK_STATUS.TODO),
    [TASK_STATUS.IN_PROGRESS]: tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS),
    [TASK_STATUS.DONE]: tasks.filter((t) => t.status === TASK_STATUS.DONE),
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" text="Loading board..." />
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex space-x-6 overflow-x-auto pb-6">
          {Object.values(COLUMNS).map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={groupedTasks[column.status] || []}
              onAddTask={handleAddTask}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Modals */}
      {showCreateModal && (
        <CreateTaskModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedColumn(null);
          }}
          projectId={projectId}
          initialStatus={selectedColumn}
        />
      )}

      {showEditModal && selectedTask && (
        <EditTaskModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
        />
      )}
    </>
  );
};

KanbanBoard.propTypes = {
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default KanbanBoard;
