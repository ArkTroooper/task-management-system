/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as taskService from '../services/task.service';

// Initial state
const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

// Action types
const TASK_ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  MOVE_TASK: 'MOVE_TASK',
};

// Reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case TASK_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null,
      };
    case TASK_ACTIONS.FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case TASK_ACTIONS.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };
    case TASK_ACTIONS.MOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    default:
      return state;
  }
};

// Create context
export const TaskContext = createContext();

// Provider component
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Fetch all tasks for a project
  const fetchTasks = useCallback(async (projectId) => {
    dispatch({ type: TASK_ACTIONS.FETCH_START });
    try {
      const data = await taskService.getAllTasks(projectId);
      dispatch({ type: TASK_ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: TASK_ACTIONS.FETCH_FAILURE, payload: error.message });
    }
  }, []);

  // Create task
  const createTask = useCallback(async (taskData) => {
    const data = await taskService.createTask(taskData);
    dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: data });
    return data;
  }, []);

  // Update task
  const updateTask = useCallback(async (taskId, taskData) => {
    const data = await taskService.updateTask(taskId, taskData);
    dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: data });
    return data;
  }, []);

  // Delete task
  const deleteTask = useCallback(async (taskId) => {
    await taskService.deleteTask(taskId);
    dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: taskId });
  }, []);

  // Move task
  const moveTask = useCallback(async (taskId, newStatus, newPosition) => {
    const data = await taskService.moveTask(taskId, newStatus, newPosition);
    dispatch({ type: TASK_ACTIONS.MOVE_TASK, payload: data });
    return data;
  }, []);

  const value = {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

TaskProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
