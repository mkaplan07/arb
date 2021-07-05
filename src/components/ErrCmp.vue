<template>
  <div>
    <p id="errorMsg">There may be an issue at CoinGecko.<br>
      Wait a bit then restart the widget.</p>
    <button type="button" @click="reload">Restart</button>
  </div>
</template>

<script>
export default {
  methods: {
    reload() {
      this.$emit('reload');
    }
  }
}
</script>

<style scoped>
  #errorMsg {
    line-height: 1.2;
    margin: 10px auto;
  }
  button {
    background-color: #bedf90; /* #8dc73d */
    border: none;
    padding: 4px 8px;

    font-style: italic;
  }
</style>
