<template>
  <div v-if="loadCmp">
    <p id="arb-perc">{{ perc }}</p>
    <div id="arb-output" v-show="loImg && hiImg">
      <div class="arb-detail">
        <img class="arb-logo" :src="logos[0]" :alt="loEx" @load="loadImg('lo')">
        <div>
          <div>{{ loEx }}</div>
          <div>{{ loLast }}</div>
        </div>
      </div>
      <div class="arb-detail">
        <img class="arb-logo" :src="logos[1]" :alt="hiEx" @load="loadImg('hi')">
        <div>
          <div>{{ hiEx }}</div>
          <div>{{ hiLast }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p class="arb-p">Loading opportunity<span class="ell-1">.</span>
      <span class="ell-2">.</span>
      <span class="ell-3">.</span>
    </p>
  </div>
</template>

<script>
export default {
  props: ['prices'],
  data() {
    return {
      perc: '',
      logos: [],
      loEx: '',
      hiEx: '',
      loLast: '',
      hiLast: '',
      currentOpp: null,
      loadCmp: false,
      loImg: false,
      hiImg: false
    }
  },
  watch: {
    prices() {
      this.getArb();
    }
  },
  methods: {
    loadImg(img) {
      if (img === 'lo') {
        this.loImg = true;
      } else {
        this.hiImg = true;
      }
    },
    async getLogos(exchange) {
      try {
        let res = await fetch(`https://api.coingecko.com/api/v3/exchanges/${exchange}`);
        let arrJSON = await res.json();

        this.logos.push(arrJSON.image);
      } catch {
        this.$emit('failedReq');
      }
    },
    truncateExchange(exchange) {
      if (exchange.length > 15) {
        let words = exchange.split(' ');
        return words.length > 1 ? words[0] : exchange.slice(0, 15) + '...';
      }
      return exchange;
    },
    resetCmp() {
      this.perc = '';
      this.logos = [];
      this.loadCmp = false;
      this.loImg = false;
      this.hiImg = false;
    },
    async getDetails(low, high) {
      this.resetCmp();

      await this.getLogos(low.market.identifier);
      await this.getLogos(high.market.identifier);
      console.log(`logos: ${this.logos[0]}, ${this.logos[1]}`);

      this.loLast = low.last.toFixed(4);
      this.hiLast = high.last.toFixed(4);
      this.perc = `${(((this.hiLast - this.loLast) / this.loLast) * 100).toFixed(4)}%`;

      this.loEx = this.truncateExchange(low.market.name);
      this.hiEx = this.truncateExchange(high.market.name);
    },
    async getArb() {
      let low = this.prices[0];
      let high = this.prices[this.prices.length - 1];

      let latest = `${low.market.identifier} ${low.last} vs. ${high.market.identifier} ${high.last}`;

      if (latest !== this.currentOpp) {
        await this.getDetails(low, high);
        this.currentOpp = latest;
      }

      console.log(this.currentOpp);
      this.loadCmp = true;
    }
  }
}
</script>

<style scoped>
  #arb-perc {
    font-size: 16px;
  }
  #arb-output {
    display: flex;
    width: 320px;
    margin: 0 auto;
  }
  .arb-detail {
    display: flex;
    justify-content: center;

    width: 50%;
  }
  .arb-logo {
    width: 25px;
    height: 25px; /* Safari */

    padding-right: 10px;
  }
</style>
