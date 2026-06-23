<script setup lang="ts">

definePageMeta({
    // layout: 'dashboard-layout',
    middleware: 'authenticated'
})

</script>


<template>
    <div>
        <!-- <h1>Hola mundo - dashboard page</h1> -->
        <NuxtPage />
    </div>
</template>
