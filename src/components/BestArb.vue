<template>
  <div v-if="loadCmp">
    <p id="perc">{{ perc }}</p>
    <div id="output">
      <div class="detail">
        <!-- <img :src="logos[0]" :alt="loEx" @load="loadImg('loImg')" v-show="loImg"> -->
        <img :src="logos[0]" :alt="loEx">
        <div class="text">
          <div>{{ loEx }}</div>
          <div>{{ loLast }}</div>
        </div>
      </div>
      <div class="detail">
        <!-- <img :src="logos[1]" :alt="hiEx" @load="loadImg('hiImg')" v-show="hiImg"> -->
        <img :src="logos[1]" :alt="hiEx">
        <div class="text">
          <div>{{ hiEx }}</div>
          <div>{{ hiLast }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading opportunity...</p>
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
  p {
    width: 100%;
    margin: 16px auto 0;
  }
  #perc {
    font-size: 16px;
  }
  #output {
    display: flex;
    justify-content: center;

    width: 100%;
  }
  .detail {
    padding: 0 10px;
    width: 50%;
  }
  img {
    float: left;
    width: 25px;
  }
  .text {
    padding: 10px 10px 0 0;
  }
</style>
