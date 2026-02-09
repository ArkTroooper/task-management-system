import { createContext, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as projectService from '../services/project.service';

// Initial state
const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

// Action types
const PROJECT_ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
  SET_CURRENT_PROJECT: 'SET_CURRENT_PROJECT',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
};

// Reducer
const projectReducer = (state, action) => {
  switch (action.type) {
    case PROJECT_ACTIONS.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case PROJECT_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        projects: action.payload,
        loading: false,
        error: null,
      };
    case PROJECT_ACTIONS.FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case PROJECT_ACTIONS.SET_CURRENT_PROJECT:
      return {
        ...state,
        currentProject: action.payload,
      };
    case PROJECT_ACTIONS.ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case PROJECT_ACTIONS.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
        currentProject:
          state.currentProject?.id === action.payload.id
            ? action.payload
            : state.currentProject,
      };
    case PROJECT_ACTIONS.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
        currentProject:
          state.currentProject?.id === action.payload ? null : state.currentProject,
      };
    default:
      return state;
  }
};

// Create context
export const ProjectContext = createContext();

// Provider component
export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    dispatch({ type: PROJECT_ACTIONS.FETCH_START });
    try {
      const data = await projectService.getAllProjects();
      dispatch({ type: PROJECT_ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: PROJECT_ACTIONS.FETCH_FAILURE, payload: error.message });
    }
  }, []);

  // Set current project
  const setCurrentProject = useCallback(async (projectId) => {
    try {
      const data = await projectService.getProjectById(projectId);
      dispatch({ type: PROJECT_ACTIONS.SET_CURRENT_PROJECT, payload: data });
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  }, []);

  // Create project
  const createProject = useCallback(async (projectData) => {
    try {
      const data = await projectService.createProject(projectData);
      dispatch({ type: PROJECT_ACTIONS.ADD_PROJECT, payload: data });
      return data;
    } catch (error) {
      throw error;
    }
  }, []);

  // Update project
  const updateProject = useCallback(async (projectId, projectData) => {
    try {
      const data = await projectService.updateProject(projectId, projectData);
      dispatch({ type: PROJECT_ACTIONS.UPDATE_PROJECT, payload: data });
      return data;
    } catch (error) {
      throw error;
    }
  }, []);

  // Delete project
  const deleteProject = useCallback(async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      dispatch({ type: PROJECT_ACTIONS.DELETE_PROJECT, payload: projectId });
    } catch (error) {
      throw error;
    }
  }, []);

  const value = {
    projects: state.projects,
    currentProject: state.currentProject,
    loading: state.loading,
    error: state.error,
    fetchProjects,
    setCurrentProject,
    createProject,
    updateProject,
    deleteProject,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

ProjectProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
