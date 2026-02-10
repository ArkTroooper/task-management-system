import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { TaskContext } from '../../context/TaskContext';
import { TASK_PRIORITY } from '../../utils/constants';

const CreateTaskModal = ({ isOpen, onClose, projectId, initialStatus }) => {
  const { createTask } = useContext(TaskContext);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: TASK_PRIORITY.MEDIUM,
    dueDate: '',
    status: initialStatus || 'todo',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await createTask({
        ...formData,
        projectId,
      });
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to create task' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" size="md">
      <form onSubmit={handleSubmit}>
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          error={errors.title}
          required
        />

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows="4"
            className="w-full px-4 py-2 rounded-md bg-grey-darkest border border-grey-medium text-text-primary placeholder-grey-light focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="priority" className="block text-sm font-medium text-text-primary mb-2">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-grey-darkest border border-grey-medium text-text-primary"
          >
            <option value={TASK_PRIORITY.LOW}>Low</option>
            <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
            <option value={TASK_PRIORITY.HIGH}>High</option>
          </select>
        </div>

        <Input
          label="Due Date"
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />

        {errors.submit && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-20 border border-red-500 rounded-md text-red-400 text-sm">
            {errors.submit}
          </div>
        )}

        <div className="flex space-x-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading} className="flex-1">
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

CreateTaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  initialStatus: PropTypes.string,
};

export default CreateTaskModal;
