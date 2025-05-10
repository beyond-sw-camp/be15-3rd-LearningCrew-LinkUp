<script setup>
import SidebarMainLayout from '@/components/layout/SidebarMainLayout.vue';
import SidebarMenuBusiness from '@/features/user/components/SidebarMenuBusiness.vue';
import DefaultMainLayout from '@/components/layout/DefaultMainLayout.vue';
</script>

<template>
  <SidebarMainLayout width="350px" mainClass="h-[calc(100vh-100px)]">
    <template #sidebar>
      <SidebarMenuBusiness />
    </template>

    <template #main>
      <DefaultMainLayout main-class="w-[600px]">
        <RouterView />
      </DefaultMainLayout>
    </template>
  </SidebarMainLayout>
</template>

<style scoped></style>
