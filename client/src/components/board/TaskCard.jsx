import PropTypes from 'prop-types';
import { Draggable } from '@hello-pangea/dnd';
import { formatDate, getPriorityColor, getInitials, truncateText } from '../../utils/helpers';

const TaskCard = ({ task, index, onClick }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={`card p-4 mb-3 cursor-pointer hover:shadow-xl transition-shadow ${
            snapshot.isDragging ? 'opacity-70 rotate-2' : ''
          }`}
        >
          {/* Priority indicator */}
          <div className="flex items-start justify-between mb-2">
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
            <span className="text-xs text-text-muted">{task.id}</span>
          </div>

          {/* Task title */}
          <h4 className="text-text-secondary font-semibold mb-2">{task.title}</h4>

          {/* Task description */}
          {task.description && (
            <p className="text-sm text-text-muted mb-3">
              {truncateText(task.description, 80)}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Assigned user */}
            {task.assignedTo && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-grey-medium text-text-primary text-xs rounded-full flex items-center justify-center font-semibold">
                  {getInitials(task.assignedTo.username || task.assignedTo.email)}
                </div>
              </div>
            )}

            {/* Due date */}
            {task.dueDate && (
              <span className="text-xs text-text-muted">
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.string,
    dueDate: PropTypes.string,
    assignedTo: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
    }),
  }).isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TaskCard;
