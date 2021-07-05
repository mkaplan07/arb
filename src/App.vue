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
    <div v-else-if="coin && !quote">
      <p class="arb-p">{{ loadQuotes }}</p>
    </div>
    <div v-else-if="coin && quote && !prices.length">
      <p class="arb-p">Fetching data...</p>
    </div>
    <div v-else-if="coin && quote && noHits">
      <p class="arb-p">No results. Try a different quote currency.</p>
    </div>
    <best-arb
      v-else-if="coin && quote && prices.length"
      :prices="prices"
      @failedReq="setError"
    >
    </best-arb>
    <div v-else v-show="okLogo">
      <img id="cglogo" src="https://static.coingecko.com/s/coingecko-branding-guide-4f5245361f7a47478fa54c2c57808a9e05d31ac7ca498ab189a3827d6000e22b.png" alt="CoinGecko logo" @load="loadLogo">
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
      error: null,
      okLogo: false
    }
  },
  mounted() {
    this.getCoins();
  },
  computed: {
    loadQuotes() {
      if (!this.quotes.length) {
        return 'Fetching data...';
      } else {
        return 'Choose a quote currency';
      }
    }
  },
  methods: {
    arbCheck() {
      this.prices.length = 0; // for if-else

      if (this.loop) {
        clearInterval(this.loop);
      }

      this.loop = setInterval(() => {
        this.getPrices(this.coin, this.quote);
      }, 2000);
    },
    async getCoins() {
      this.error = false;
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
      } catch {
        this.setError();
      }
    },
    async getSymbols() {
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
    resetQuotes() {
      clearInterval(this.loop);
      this.quote = '';
      this.prices.length = 0;
      this.noHits = false;
    },
    async getQuotes(base) {
      this.resetQuotes();
      try {
        let res = await fetch(`https://api.coingecko.com/api/v3/coins/${this.coin}/tickers`);
        let arrJSON = await res.json();

        let quotes = [];
        arrJSON.tickers.forEach(obj => {
          if (obj.base === base) { // base is BTC, not WBTC
            quotes.push(obj.target);
          }
        });

        // remove duplicate currencies
        this.quotes = quotes.filter((quote, idx, src) => src.indexOf(quote) === idx);
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
          return;
        }

        this.noHits = false;
      } catch {
        this.setError();
      }
    },
    setError() {
      this.error = true;
      this.coin = ''
      this.coins = [];
      this.quotes = [];
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

    background-color: #fff;

    text-align: center;
    line-height: 1;

    border: 1px solid gray;

    font-size: small;
    font-family: Helvetica;
    color: #555;
  }
  #arb-selects {
    width: 100%;

    display: flex;
    justify-content: space-evenly;

    margin-top: 10px;
  }
  #arb-selects select {
    appearance: none;
    border: none;
    outline: none;

    padding: 0 10px 0;

    background-color: #e7e7e7;

    height: 25px;
  }
  .arb-p {
    margin-top: 16px;
  }
  #cglogo {
    max-width: 50%;
    margin-top: 15px;
  }
</style>
