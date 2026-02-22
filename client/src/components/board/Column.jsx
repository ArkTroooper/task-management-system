import PropTypes from 'prop-types';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import Button from '../common/Button';

const Column = ({ column, tasks, onAddTask, onTaskClick }) => {
  return (
    <div className="bg-grey-darkest border border-grey-medium rounded-lg p-4 min-w-[320px]">
      {/* Column header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-text-secondary font-semibold text-lg">{column.title}</h3>
          <span className="text-sm text-text-muted bg-grey-dark px-2 py-1 rounded">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[500px] ${
              snapshot.isDraggingOver ? 'bg-hover bg-opacity-20 rounded-lg' : ''
            }`}
          >
            {/* Task cards */}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onClick={onTaskClick}
              />
            ))}
            {provided.placeholder}

            {/* Empty state */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-40 text-text-muted text-sm">
                No tasks yet
              </div>
            )}
          </div>
        )}
      </Droppable>

      {/* Add task button */}
      <Button
        variant="secondary"
        onClick={() => onAddTask(column.id)}
        className="w-full mt-3"
      >
        <span className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </span>
      </Button>
    </div>
  );
};

Column.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  tasks: PropTypes.array.isRequired,
  onAddTask: PropTypes.func.isRequired,
  onTaskClick: PropTypes.func.isRequired,
};

export default Column;
