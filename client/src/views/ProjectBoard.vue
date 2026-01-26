<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button @click="goBack" class="text-gray-600 hover:text-gray-900">
            ← Back
          </button>
          <h1 class="text-2xl font-bold text-gray-900">{{ project?.name || 'Loading...' }}</h1>
        </div>
        <button @click="showCreateModal = true" class="btn btn-primary">
          + New Task
        </button>
      </div>
    </nav>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Loading tasks...</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Todo Column -->
        <div class="bg-gray-100 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4 text-gray-700">To Do</h3>
          <draggable
            v-model="todoTasks"
            group="tasks"
            @change="handleDragChange($event, 'todo')"
            item-key="id"
            class="min-h-[200px]"
          >
            <template #item="{ element }">
              <TaskCard :task="element" @edit="editTask" @delete="deleteTask" />
            </template>
          </draggable>
        </div>
        
        <!-- In Progress Column -->
        <div class="bg-blue-100 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4 text-blue-700">In Progress</h3>
          <draggable
            v-model="inProgressTasks"
            group="tasks"
            @change="handleDragChange($event, 'in_progress')"
            item-key="id"
            class="min-h-[200px]"
          >
            <template #item="{ element }">
              <TaskCard :task="element" @edit="editTask" @delete="deleteTask" />
            </template>
          </draggable>
        </div>
        
        <!-- Done Column -->
        <div class="bg-green-100 rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4 text-green-700">Done</h3>
          <draggable
            v-model="doneTasks"
            group="tasks"
            @change="handleDragChange($event, 'done')"
            item-key="id"
            class="min-h-[200px]"
          >
            <template #item="{ element }">
              <TaskCard :task="element" @edit="editTask" @delete="deleteTask" />
            </template>
          </draggable>
        </div>
      </div>
    </div>
    
    <!-- Create/Edit Task Modal -->
    <div
      v-if="showCreateModal || editingTask"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-2xl font-bold mb-4">
          {{ editingTask ? 'Edit Task' : 'Create New Task' }}
        </h3>
        
        <form @submit.prevent="handleSaveTask" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              v-model="taskForm.title"
              type="text"
              class="input"
              placeholder="Task title"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="taskForm.description"
              class="input"
              rows="3"
              placeholder="Task description..."
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="taskForm.status" class="input">
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          
          <div class="flex gap-2">
            <button type="submit" class="btn btn-primary flex-1" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '../stores/project';
import { useTaskStore } from '../stores/task';
import socket from '../services/socket';
import draggable from 'vuedraggable';
import TaskCard from '../components/TaskCard.vue';

const route = useRoute();
const router = useRouter();
const projectStore = useProjectStore();
const taskStore = useTaskStore();

const projectId = ref(parseInt(route.params.id));
const project = ref(null);
const loading = ref(false);
const showCreateModal = ref(false);
const editingTask = ref(null);
const saving = ref(false);
const taskForm = ref({
  title: '',
  description: '',
  status: 'todo'
});

const todoTasks = computed({
  get: () => taskStore.todoTasks,
  set: (value) => {
    taskStore.tasks = [
      ...value,
      ...taskStore.inProgressTasks,
      ...taskStore.doneTasks
    ];
  }
});

const inProgressTasks = computed({
  get: () => taskStore.inProgressTasks,
  set: (value) => {
    taskStore.tasks = [
      ...taskStore.todoTasks,
      ...value,
      ...taskStore.doneTasks
    ];
  }
});

const doneTasks = computed({
  get: () => taskStore.doneTasks,
  set: (value) => {
    taskStore.tasks = [
      ...taskStore.todoTasks,
      ...taskStore.inProgressTasks,
      ...value
    ];
  }
});

onMounted(async () => {
  loading.value = true;
  try {
    project.value = await projectStore.fetchProject(projectId.value);
    await taskStore.fetchTasks(projectId.value);
    
    // Join project room for real-time updates
    socket.joinProject(projectId.value);
    
    // Listen for real-time task events
    socket.onTaskCreated((task) => {
      taskStore.addTask(task);
    });
    
    socket.onTaskUpdated((task) => {
      taskStore.updateTaskLocal(task);
    });
    
    socket.onTaskDeleted((taskId) => {
      taskStore.removeTask(taskId);
    });
  } catch (error) {
    console.error('Failed to load project:', error);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  // Leave project room and cleanup listeners
  socket.leaveProject(projectId.value);
  socket.off('task:created');
  socket.off('task:updated');
  socket.off('task:deleted');
});

const goBack = () => {
  router.push('/dashboard');
};

const handleDragChange = async (event, newStatus) => {
  if (event.added) {
    const task = event.added.element;
    await taskStore.updateTask(task.id, { status: newStatus });
  }
};

const editTask = (task) => {
  editingTask.value = task;
  taskForm.value = {
    title: task.title,
    description: task.description || '',
    status: task.status
  };
};

const handleSaveTask = async () => {
  saving.value = true;
  try {
    if (editingTask.value) {
      await taskStore.updateTask(editingTask.value.id, taskForm.value);
    } else {
      await taskStore.createTask({
        ...taskForm.value,
        project_id: projectId.value
      });
    }
    closeModal();
  } catch (error) {
    console.error('Failed to save task:', error);
  } finally {
    saving.value = false;
  }
};

const deleteTask = async (taskId) => {
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }
  
  try {
    await taskStore.deleteTask(taskId);
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  editingTask.value = null;
  taskForm.value = {
    title: '',
    description: '',
    status: 'todo'
  };
};
</script>
