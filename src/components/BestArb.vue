<template>
  <div v-if="loadCmp">
    <p id="arb-perc">{{ perc }}</p>
    <div id="arb-output">
      <div class="arb-detail">
        <!-- <img :src="logos[0]" :alt="loEx" @load="loadImg('loImg')" v-show="loImg"> -->
        <img class="arb-logo" :src="logos[0]" :alt="loEx">
        <div>
          <div>{{ loEx }}</div>
          <div>{{ loLast }}</div>
        </div>
      </div>
      <div class="arb-detail">
        <!-- <img :src="logos[1]" :alt="hiEx" @load="loadImg('hiImg')" v-show="hiImg"> -->
        <img class="arb-logo" :src="logos[1]" :alt="hiEx">
        <div>
          <div>{{ hiEx }}</div>
          <div>{{ hiLast }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p class="arb-p">Loading opportunity...</p>
  </div>
</template>

<script>
export default {
  props: ['prices', 'error'],
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
      // loImg: false,
      // hiImg: false,
    }
  },
  watch: {
    prices() {
      this.getArb();
    }
  },
  methods: {
    // loadImg(img) {
    //   if (img === 'loImg') {
    //     this.loImg = true;
    //   } else {
    //     this.hiImg = true;
    //   }
    // },
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
      this.loadCmp = false;

      this.logos = [];
      // this.loImg = false;
      // this.hiImg = false;
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
  #arb-perc {
    font-size: 16px;

    width: 100%;
    margin-top: 16px;
  }
  #arb-output {
    display: flex;
    justify-content: center;

    width: 100%;
    margin-top: 10px;
  }
  .arb-detail {
    display: flex;
    align-items: center;

    padding: 0 10px;
    width: 50%;
  }
  .arb-logo {
    width: 25px;
    padding-right: 10px;
  }
</style>
