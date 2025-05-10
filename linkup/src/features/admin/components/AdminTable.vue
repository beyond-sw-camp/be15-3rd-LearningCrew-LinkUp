<script setup>

// 데이터/컬럼 구조가 다양하므로 slot 기반 구성
</script>

<template>
  <table class="admin-table table">
    <caption class="sr-only">관리자 데이터 테이블</caption>
    <thead>
    <slot name="thead" />
    </thead>
    <tbody>
    <slot name="tbody" />
    </tbody>
  </table>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-bottom: 32px;
}

.table th,
.table td {
  padding: 14px 12px;
  text-align: left;
  vertical-align: middle;
}

.table thead th {
  background-color: #f5f3fa;
  border-bottom: 1px solid #e3e1ed;
  font-weight: 500;
  color: #444;
}

.table tbody td {
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}
</style>
