import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { ProjectContext } from '../../context/ProjectContext';

const CreateProjectModal = ({ isOpen, onClose }) => {
  const { createProject } = useContext(ProjectContext);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
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
      await createProject(formData);
      onClose();
      // Reset form
      setFormData({ name: '', description: '' });
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to create project' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" size="md">
      <form onSubmit={handleSubmit}>
        <Input
          label="Project Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter project name"
          error={errors.name}
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
            placeholder="Enter project description"
            rows="4"
            className="w-full px-4 py-2 rounded-md bg-grey-darkest border border-grey-medium text-text-primary placeholder-grey-light focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
          />
        </div>

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
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

CreateProjectModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreateProjectModal;
