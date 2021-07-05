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
    border: 1px solid #c7c7c7;
    padding: 4px 8px;
    transition: background-color 0.1s linear;
  }
  button:hover {
    background-color: #bedf90; /* #8dc73d */
  }
  button:active {
    border: 1px solid #fff;
  }
</style>
