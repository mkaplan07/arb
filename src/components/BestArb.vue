<template>
  <div v-if="loadCmp">
    <p>{{ perc }}</p>
    <div id="output">
      <div class="detail">
        <img :src="logos[0]" :alt="loEx" @load="loadImg('loImg')" v-show="loImg">
        <div class="text">
          <div>{{ loEx }}</div>
          <div>{{ loLast }}</div>
        </div>
      </div>
      <div class="detail">
        <img :src="logos[1]" :alt="hiEx" @load="loadImg('hiImg')" v-show="hiImg">
        <div class="text">
          <div>{{ hiEx }}</div>
          <div>{{ hiLast }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading Arb...</p>
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
  watch: {
    prices() {
      this.getArb();
    }
  },
  methods: {
    loadImg(img) {
      if (img === 'loImg') {
        this.loImg = true;
      } else {
        this.hiImg = true;
      }
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
    resetCmp() {
      this.loadCmp = false;

      this.logos = [];
      this.loImg = false;
      this.hiImg = false;
    },
    async getDetails(low, high) {
      this.resetCmp();

      this.loId = low.market.identifier;
      this.hiId = high.market.identifier;

      await this.getLogos(low.market.identifier);
      await this.getLogos(high.market.identifier);

      this.perc = `${(((this.hiLast - this.loLast) / this.loLast) * 100).toFixed(4)}%`;
      this.loEx = this.truncateExchange(low.market.name);
      this.hiEx = this.truncateExchange(high.market.name);
    },
    async getArb() {
      let low = this.prices[0];
      this.loLast = low.last.toFixed(4);

      let high = this.prices[this.prices.length - 1];
      this.hiLast = high.last.toFixed(4);

      console.log(low.market.identifier, high.market.identifier);

      if (this.loId !== low.market.identifier || this.hiId !== high.market.identifier) {
        await this.getDetails(low, high);
      }

      this.loadCmp = true;
    }
  }
}
</script>

<style scoped>
p {
  width: 180px;
  height: 18px;

  margin: 16px auto 0;
}
#output {
  display: flex;
  justify-content: center;

  width: 140px;
  height: 25px;

  margin: 0 auto;

  font-size: small;
}
.detail {
  padding: 0 10px;
}
img {
  float: left;
  width: 25px;
  padding: 0 5px 0 5px;
}
.text {
  width: 115px;
  padding-top: 10px;

  font-size: small;
}
</style>
