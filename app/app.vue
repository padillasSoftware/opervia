<script setup lang="ts">
useSeoMeta({
  title: 'Opervia | Gestiona tu centro de bienestar',
  description:
    'Opervia es la plataforma todo en uno para profesionales y negocios de servicios. Gestiona citas, clientes, empleados y operaciones desde un solo lugar.',

  ogTitle: 'Opervia | Gestiona tu centro de bienestar',
  ogDescription:
    'Administra citas, clientes, empleados y reportes desde una sola plataforma.',

  ogType: 'website',
  ogUrl: 'https://opervia.com',
  ogImage: '/og-image.png',

  twitterCard: 'summary_large_image',
  twitterTitle: 'Opervia | Gestiona tu centro de bienestar',
  twitterDescription:
    'La plataforma todo en uno para profesionales y negocios de servicios.',

  twitterImage: '/og-image.png',
});

</script>

<template>
  <UApp :toaster="{ position: 'top-center' }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
