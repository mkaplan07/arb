<template>
  <div>
    <p>{{ perc }}</p>
    <div id="lowHigh">
      <span>{{ low }}</span>
      <span>{{ high }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['perc', 'low', 'high']
}
</script>

<style scoped>
p {
  max-width: 180px;
  margin: 10px auto;
}
#lowHigh {
  display: flex;
  justify-content: space-around;
  font-size: small;
}
</style>
