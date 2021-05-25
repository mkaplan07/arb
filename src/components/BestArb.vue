<template>
  <div>
    <p>{{ perc }}</p>
    <div id="loHi">
      <div class="details">
        <img :src="logos[0]" alt="exchange logo" @load="loadLo">
        <div>
          <div>{{ loEx }}</div>
          <div>{{ loLast }}</div>
        </div>
      </div>
      <div class="details">
        <img :src="logos[1]" alt="exchange logo" @load="loadHi">
        <div>
          <div>{{ hiEx }}</div>
          <div>{{ hiLast }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['perc', 'logos', 'loEx', 'loLast', 'hiEx', 'hiLast'],
  data() {
    return {
      loImgLoaded: false, // https://renatello.com/vue-js-image-loaded/
      hiImgLoaded: false,
    }
  },
  methods: {
    loadLo() {
      this.loImgLoaded = true
    },
    loadHi() {
      this.hiImgLoaded = true;
    }
  }
}
</script>

<style scoped>
p {
  max-width: 180px;
  margin: 10px auto;
}
#loHi {
  display: flex;
  justify-content: space-around;
}
.details {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;

  width: 120px;
  height: 35px;
  /* https://css-tricks.com/content-jumping-avoid/  */

  font-size: small;
}
.details img {
  width: 25px;
}
</style>
