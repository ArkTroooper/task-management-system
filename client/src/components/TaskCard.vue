<template>
  <div class="task-card">
    <h4 class="font-semibold mb-2">{{ task.title }}</h4>
    <p v-if="task.description" class="text-sm text-gray-600 mb-3">
      {{ task.description }}
    </p>
    <div class="flex justify-between items-center">
      <span v-if="task.assignee" class="text-xs text-gray-500">
        @{{ task.assignee.username }}
      </span>
      <div class="flex gap-2">
        <button
          @click.stop="$emit('edit', task)"
          class="text-blue-600 hover:text-blue-800 text-sm"
        >
          Edit
        </button>
        <button
          @click.stop="$emit('delete', task.id)"
          class="text-red-600 hover:text-red-800 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);
</script>
