<template>
  <apexchart type="pie" height="300" :options="chartOptions" :series="series" :key="chartKey" />
</template>

<script setup lang="ts">
import VueApexCharts from "vue3-apexcharts";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

interface ActivityTypeData {
  op_type_name: string;
  count: number;
}

const route = useRoute();
const series = ref<number[]>([]);
const chartKey = ref<number>(0);
const chartOptions = ref({
  chart: {
    type: "pie",
  },
  labels: [] as string[],
  colors: ["#556ee6", "#34c38f", "#f46a6a", "#f1b44c", "#50a5f1", "#6f42c1", "#e83e8c", "#fd7e14", "#20c997", "#6c757d"],
  legend: {
    show: true,
    position: "bottom",
  },
});

// Backend-аас үйл ажиллагааны төрлүүдийн өгөгдөл авах функц
async function fetchActivityTypes(payCenterId: string) {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/markets?pay_center_id=${payCenterId}`);
    const data = await response.json();
    
    console.log('Raw API response:', data);
    
    let organizations: any[] = [];
    if (Array.isArray(data)) {
      organizations = data;
    } else if (data.data && Array.isArray(data.data)) {
      organizations = data.data;
    }

    console.log('Parsed organizations:', organizations);

    // OP_TYPE_NAME-ууд тоолох
    const activityTypes: { [key: string]: number } = {};
    
    organizations.forEach((org: any) => {
      const opType = org.op_type_name || org.OP_TYPE_NAME || 'Тодорхойгүй';
      console.log('Processing org:', org.stor_name, 'OP_TYPE_NAME:', opType);
      if (activityTypes[opType]) {
        activityTypes[opType]++;
      } else {
        activityTypes[opType] = 1;
      }
    });

    console.log('Activity types counted:', activityTypes);

    // Тоогоор эрэмбэлж, хамгийн их 10-ийг авах
    const sortedEntries = Object.entries(activityTypes)
      .sort(([,a], [,b]) => b - a) // Тоогоор буурах эрэмбээр
      .slice(0, 10); // Хамгийн их 10

    // Үлдсэн бүгдийг "Бусад" гэж нэгтгэх
    const remainingEntries = Object.entries(activityTypes)
      .sort(([,a], [,b]) => b - a)
      .slice(10);
    
    let labels: string[] = [];
    let values: number[] = [];

    if (sortedEntries.length === 0) {
      // Хэрэв өгөгдөл байхгүй бол
      labels = ["Мэдээлэл байхгүй"];
      values = [1];
    } else {
      // Эхний 10-ийг нэмэх
      labels = sortedEntries.map(([name]) => name);
      values = sortedEntries.map(([, count]) => count);

      // Үлдсэн бүгдийг "Бусад" болгон нэмэх
      if (remainingEntries.length > 0) {
        const othersCount = remainingEntries.reduce((sum, [, count]) => sum + count, 0);
        labels.push("Бусад");
        values.push(othersCount);
      }
    }

    console.log('Final chart labels:', labels);
    console.log('Final chart values:', values);
    
    chartOptions.value.labels = labels;
    series.value = values;
    chartKey.value++; // Force re-render
  } catch (error) {
    console.error('Error fetching activity types:', error);
    // Алдаа гарвал анхны статик өгөгдөл харуулна
    chartOptions.value.labels = ["Үйлчилгээ", "Худалдаа", "Хүнс", "Тээвэр", "Бусад"];
    series.value = [44, 55, 13, 43, 22];
  }
}

onMounted(() => {
  const payCenterId = route.query.id as string;
  if (payCenterId) {
    fetchActivityTypes(payCenterId);
  }
});

// URL параметр өөрчлөгдөхөд дахин татах
watch(() => route.query.id, (newId) => {
  if (newId) {
    fetchActivityTypes(newId as string);
  }
});
</script>

<script lang="ts">
export default {
  components: {
    apexchart: VueApexCharts,
  },
};
</script>
