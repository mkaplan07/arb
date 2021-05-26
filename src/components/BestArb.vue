<template>
  <div v-show="loadCmp">
    <p>{{ perc }}</p>
    <div id="loHi">
      <div class="details">
        <img :src="logos[0]" alt="exchange logo" @load="loadImg('loImg')" v-show="loImg">
        <div class="text">
          <div>{{ loEx }}</div>
          <div>{{ loLast }}</div>
        </div>
      </div>
      <div class="details">
        <img :src="logos[1]" alt="exchange logo" @load="loadImg('hiImg')" v-show="hiImg">
        <div class="text">
          <div>{{ hiEx }}</div>
          <div>{{ hiLast }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['prices'],
  data() {
    return {
      perc: '',
      logos: [],
      loLast: '',
      hiLast: '',
      loId: '',
      hiId: '',
      loEx: '',
      hiEx: '',
      loadCmp: false,
      loImg: false,
      hiImg: false,
    }
  },
  beforeMount() { // mounted?
    this.getDetails();
  },
  methods: {
    loadImg(img) {
      this[img] = true; // https://renatello.com/vue-js-image-loaded/
    },
    async getLogos(exchange) {
      let res = await fetch(`https://api.coingecko.com/api/v3/exchanges/${exchange}`);
      let arrJSON = await res.json();

      this.logos.push(arrJSON.image);
    },
    truncateExchange(exchange) {
      if (exchange.length > 15) {
        let words = exchange.split(' ');
        return words.length > 1 ? words[0] : exchange.slice(0, 15) + '...';
      }
      return exchange;
    },
    async getDetails() {
      let low = this.prices[0];
      this.loLast = low.last.toFixed(4);

      let high = this.prices[this.prices.length - 1];
      this.hiLast = high.last.toFixed(4);

      if (this.loId !== low.market.identifier || this.hiId !== high.market.identifier) {
        // helper function
        this.loadCmp = false;
        this.loImg=this.hiImg=false;

        this.loId = low.market.identifier;
        this.hiId = high.market.identifier;
        this.logos = [];

        await this.getLogos(low.market.identifier);
        await this.getLogos(high.market.identifier);
      }

      this.perc = `${(((this.hiLast - this.loLast) / this.loLast) * 100).toFixed(4)}%`;
      this.loEx = this.truncateExchange(low.market.name);
      this.hiEx = this.truncateExchange(high.market.name);

      this.loadCmp = true;
      console.log(`latest: ${this.loEx}, ${this.hiEx}, ${this.perc}`);
    }
  }
}
</script>

<style scoped>
p {
  width: 180px;
  height: 18px;

  margin: 10px auto;
}
#loHi {
  display: flex;
  justify-content: center;
}
.details {
  width: 120px;
  height: 35px;

  padding: 0 10px;

  font-size: small;
}
.details img {
  float: left;
  width: 25px;
}
.details .text {
  float: right;
  width: 95px;

  padding-top: 5px;
}
</style>
