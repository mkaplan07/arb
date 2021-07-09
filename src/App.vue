<template>
  <div id="arb-container">
    <div id="arb-selects">
      <select @change="getSymbols" v-model="coin">
        <option disabled value="">Choose a coin</option>
        <option
          v-for="coin in coins"
          :key="coin"
        >
        {{ coin }}
        </option>
      </select>

      <select @change="arbCheck" v-model="quote">
        <option disabled value="">Choose a quote currency</option>
        <option
          v-for="quote in quotes"
          :key="quote"
        >
        {{ quote}}
        </option>
      </select>
    </div>

    <err-cmp v-if="error" @reload="getCoins"></err-cmp>
    <div v-else-if="noHits">
      <p class="arb-p">No results. Try a different quote currency.</p>
    </div>
    <div v-else-if="coin && !this.quotes.length">
      <p class="arb-p">Fetching quote currencies<span class="e1">.</span>
        <span class="e2">.</span>
        <span class="e3">.</span>
      </p>
    </div>
    <div v-else-if="coin && !quote">
      <p class="arb-p">Choose a quote currency</p>
    </div>
    <div v-else-if="coin && !prices.length">
      <p class="arb-p">Fetching price data<span class="e1">.</span>
        <span class="e2">.</span>
        <span class="e3">.</span>
      </p>
    </div>
    <best-arb
      v-else-if="coin && prices.length"
      :prices="prices"
      @failedReq="setError"
    >
    </best-arb>
    <div v-else v-show="okLogo" id="logo">
      <p>Powered by</p>
      <a href="https://www.coingecko.com/" target="_blank">
        <img src="https://static.coingecko.com/s/coingecko-branding-guide-4f5245361f7a47478fa54c2c57808a9e05d31ac7ca498ab189a3827d6000e22b.png" alt="CoinGecko logo" @load="loadLogo">
      </a>
    </div>
  </div>
</template>

<script>
import BestArb from './components/BestArb.vue';
import ErrCmp from './components/ErrCmp.vue';

export default {
  components: {
    BestArb,
    ErrCmp
  },
  data() {
    return {
      coins: [],
      coin: '',
      quotes: [],
      quote: '',
      prices: [],
      noHits: false,
      loop: null,
      error: false,
      okLogo: false
    }
  },
  mounted() {
    this.getCoins();
  },
  methods: {
    arbCheck() {
      this.prices = []; // v-else-if="coin && !prices.length"

      if (this.loop) {
        clearInterval(this.loop);
      }

      this.loop = setInterval(() => {
        this.getPrices(this.coin, this.quote);
      }, 2000);
    },
    async getCoins() {
      try {
        let res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
        let arrJSON = await res.json();

        let arrVals = [];
        arrJSON.forEach(obj => {
          arrVals.push([obj.id, obj.market_cap]);
        });

        arrVals.sort((a, b) => b[1] - a[1]);

        let coins = [];
        arrVals.slice(0, 20).forEach(arr => coins.push(arr[0]));

        this.coins = coins;
        this.error = false; // else flickering
      } catch {
        this.setError();
      }
    },
    resetQuotes() {
      clearInterval(this.loop);
      this.quotes = [];
      this.quote = '';
      this.prices = [];
      this.noHits = false;
    },
    async getSymbols() {
      this.resetQuotes();
      try {
        let res = await fetch('https://api.coingecko.com/api/v3/coins/list');
        let arrJSON = await res.json();

        let symbols = [];
        arrJSON.forEach(obj => {
          if (this.coins.includes(obj.id)) {
            symbols.push([obj.id, obj.symbol]); // [bitcoin, btc] for each coin
          }
        });

        let base = symbols.find(sub => sub[0] === this.coin)[1].toUpperCase();
        this.getQuotes(base);
      } catch {
        this.setError();
      }
    },
    async getQuotes(base) {
      try {
        let res = await fetch(`https://api.coingecko.com/api/v3/coins/${this.coin}/tickers`);
        let arrJSON = await res.json();

        arrJSON.tickers.forEach(obj => {
          if (obj.base === base) { // base is BTC, not WBTC
            this.quotes.push(obj.target);
          }
        });

        // remove duplicate currencies
        this.quotes = this.quotes.filter((quote, idx, src) => src.indexOf(quote) === idx);
      } catch {
        this.setError();
      }
    },
    async getPrices(coin, quote) {
      try {
        let res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/tickers?depth=true`);
        let arrJSON = await res.json();

        this.prices = arrJSON.tickers.filter(ticker => ticker.target === quote);
        this.prices.sort((a, b) => a.last - b.last);

        if (this.prices.length < 2 ||
          this.prices[0].last.toFixed(4) === this.prices[this.prices.length - 1].last.toFixed(4)) {
          this.noHits = true;
        }
      } catch {
        this.setError();
      }
    },
    setError() {
      this.error = true;
      this.coins = [];
      this.coin = ''

      this.resetQuotes();
    },
    loadLogo() {
      this.okLogo = true;
    }
  }
}
</script>

<style>
  #arb-container {
    box-sizing: content-box;

    max-width: 400px;
    min-width: 320px;
    height: 120px;

    background: linear-gradient(90deg, rgba(2,0,36,.1) 0%, rgba(190,223,144,.1) 0%, rgba(0,212,255,.1) 100%);

    text-align: center;
    line-height: 1;

    border: 1px solid #c7c7c7;

    font-size: small;
    font-family: Helvetica;
    color: #222;
  }
  #arb-selects {
    width: 100%;

    display: flex;
    justify-content: space-evenly;

    margin-top: 10px;
  }
  #arb-selects select {
    appearance: none;
    border: 1px solid #c7c7c7;
    outline: none;

    padding: 0 10px 0;

    height: 25px;
  }
  .arb-p {
    margin-top: 16px;
  }
  .e1 {
    -webkit-animation: e1 2s linear infinite;
  }
  .e2 {
    -webkit-animation: e2 2s linear infinite;
  }
  .e3 {
    -webkit-animation: e3 2s linear infinite;
  }
  @-webkit-keyframes e1 {
    0% { opacity: 1; }
    65% { opacity: 1; }
    66% { opacity: 0; }
    100% { opacity: 0; }
  }
  @-webkit-keyframes e2 {
    0% { opacity: 0; }
    21% { opacity: 0; }
    22% { opacity: 1; }
    65% { opacity: 1; }
    66% { opacity: 0; }
    100% { opacity: 0; }
  }
  @-webkit-keyframes e3 {
    0% { opacity: 0; }
    43% { opacity: 0; }
    44% { opacity: 1; }
    65% { opacity: 1; }
    66% { opacity: 0; }
    100% { opacity: 0; }
  }
  #logo {
    margin: 25px 20px 0 0;
  }
  #logo p {
    font-size: 10px;
    margin: 0 0 -5px 40px;

    animation: dropin 1s;
  }
  @keyframes dropin {
    0% {
      transform: translateY(-5px);
    }
    100% {
      transform: translateY(0);
    }
  }
  #logo img {
    max-width: 33%;
    animation: fadein 1s;

    /* https://stackoverflow.com/questions/31573142/jump-at-end-of-css-transition */
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
</style>
