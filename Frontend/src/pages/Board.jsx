import { useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import KanbanBoard from '../components/board/KanbanBoard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { ProjectContext } from '../context/ProjectContext';

const Board = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, setCurrentProject, loading } = useContext(ProjectContext);

  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);

  if (loading || !currentProject) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader size="lg" text="Loading board..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              className="!px-3 !py-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-text-secondary">{currentProject.name}</h1>
              {currentProject.description && (
                <p className="text-text-muted mt-1">{currentProject.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard projectId={projectId} />
    </Layout>
  );
};

export default Board;
