<template>
  <div class="container mt-4">
    <h2>Database Diagnostic</h2>
    <button @click="runDiagnostic" class="btn btn-primary" :disabled="loading">
      {{ loading ? 'Loading...' : 'Run Diagnostic' }}
    </button>
    
    <div v-if="diagnosticData" class="mt-4">
      <h3>Diagnostic Results:</h3>
      <pre class="bg-light p-3">{{ JSON.stringify(diagnosticData, null, 2) }}</pre>
    </div>
    
    <div v-if="error" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);
const diagnosticData = ref(null);
const error = ref('');

async function runDiagnostic() {
  loading.value = true;
  error.value = '';
  diagnosticData.value = null;
  
  try {
    const response = await fetch('http://localhost:8080/api/v1/diagnostic-statistics');
    const result = await response.json();
    
    if (result.success) {
      diagnosticData.value = result.diagnostic_data;
    } else {
      error.value = 'Diagnostic failed';
    }
  } catch (e: any) {
    error.value = e.message || 'Error occurred';
  } finally {
    loading.value = false;
  }
}
</script>

<style>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style> 