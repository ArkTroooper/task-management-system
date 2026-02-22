import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import CreateProjectModal from '../components/modals/CreateProjectModal';
import Loader from '../components/common/Loader';
import { ProjectContext } from '../context/ProjectContext';
import { truncateText } from '../utils/helpers';

const Dashboard = () => {
  const navigate = useNavigate();
  const { projects, loading, fetchProjects } = useContext(ProjectContext);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleProjectClick = (projectId) => {
    navigate(`/board/${projectId}`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-secondary mb-2">Dashboard</h1>
            <p className="text-text-muted">Manage your projects and tasks</p>
          </div>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </span>
          </Button>
        </div>

        {/* Loading state */}
        {loading && projects.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <Loader size="lg" text="Loading projects..." />
          </div>
        ) : (
          <>
            {/* Empty state */}
            {projects.length === 0 ? (
              <div className="text-center py-20">
                <svg className="w-24 h-24 mx-auto text-grey-medium mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                <h2 className="text-2xl font-semibold text-text-muted mb-2">No projects yet</h2>
                <p className="text-text-muted mb-6">Create your first project to get started</p>
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                  Create Project
                </Button>
              </div>
            ) : (
              /* Project grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    className="card p-6 cursor-pointer hover:shadow-2xl transition-all hover:scale-105"
                  >
                    <h3 className="text-xl font-semibold text-text-secondary mb-2">
                      {project.name}
                    </h3>
                    <p className="text-text-muted text-sm mb-4">
                      {truncateText(project.description, 100)}
                    </p>
                    <div className="flex items-center justify-between text-sm text-text-muted">
                      <span>{project.taskCount || 0} tasks</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </Layout>
  );
};

export default Dashboard;
