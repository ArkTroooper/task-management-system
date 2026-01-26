<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Task Management</h1>
        <div class="flex items-center gap-4">
          <span class="text-gray-600">Welcome, {{ authStore.currentUser?.username }}</span>
          <button @click="handleLogout" class="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </nav>
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-gray-900">My Projects</h2>
        <button @click="showCreateModal = true" class="btn btn-primary">
          + New Project
        </button>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">Loading projects...</p>
      </div>
      
      <div v-else-if="projectStore.projects.length === 0" class="text-center py-12">
        <p class="text-gray-500 mb-4">No projects yet. Create your first project!</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="project in projectStore.projects"
          :key="project.id"
          class="card hover:shadow-lg transition-shadow cursor-pointer"
          @click="goToProject(project.id)"
        >
          <h3 class="text-xl font-semibold mb-2">{{ project.name }}</h3>
          <p class="text-gray-600 mb-4">{{ project.description || 'No description' }}</p>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>Created {{ formatDate(project.created_at) }}</span>
            <button
              @click.stop="deleteProject(project.id)"
              class="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Create Project Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showCreateModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-2xl font-bold mb-4">Create New Project</h3>
        
        <form @submit.prevent="handleCreateProject" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
            <input
              v-model="newProject.name"
              type="text"
              class="input"
              placeholder="My Awesome Project"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="newProject.description"
              class="input"
              rows="3"
              placeholder="Project description..."
            ></textarea>
          </div>
          
          <div class="flex gap-2">
            <button type="submit" class="btn btn-primary flex-1" :disabled="creating">
              {{ creating ? 'Creating...' : 'Create' }}
            </button>
            <button
              type="button"
              @click="showCreateModal = false"
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useProjectStore } from '../stores/project';

const router = useRouter();
const authStore = useAuthStore();
const projectStore = useProjectStore();

const loading = ref(false);
const showCreateModal = ref(false);
const creating = ref(false);
const newProject = ref({
  name: '',
  description: ''
});

onMounted(async () => {
  loading.value = true;
  try {
    await projectStore.fetchProjects();
  } catch (error) {
    console.error('Failed to load projects:', error);
  } finally {
    loading.value = false;
  }
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const goToProject = (id) => {
  router.push(`/project/${id}`);
};

const handleCreateProject = async () => {
  creating.value = true;
  try {
    await projectStore.createProject(newProject.value);
    newProject.value = { name: '', description: '' };
    showCreateModal.value = false;
  } catch (error) {
    console.error('Failed to create project:', error);
  } finally {
    creating.value = false;
  }
};

const deleteProject = async (id) => {
  if (!confirm('Are you sure you want to delete this project?')) {
    return;
  }
  
  try {
    await projectStore.deleteProject(id);
  } catch (error) {
    console.error('Failed to delete project:', error);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};
</script>
