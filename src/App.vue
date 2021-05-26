<template>
  <div id="container">
    <div id="selects">
      <select @change="getQuotes" v-model="coin">
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

    <div id="output">
      <div v-if="coin && !quote">
        <p>{{ loadQuotes }}</p>
      </div>
      <div v-else-if="coin && quote && !prices.length">
        <p>Waiting for Gecko...</p>
      </div>
      <div v-else-if="coin && quote && noHits">
        <p>No opportunities. Try a different quote currency.</p>
      </div>
      <div v-else-if="coin && quote && prices.length">
        <best-arb :prices="prices"></best-arb>
      </div>
      <div v-else>
        <!-- https://www.coingecko.com/en/branding -->
        <img src="../public/gecko.webp" alt="CoinGecko logo">
      </div>
    </div>

  </div>
</template>

<script>
import BestArb from './components/BestArb.vue'

export default {
  components: {
    BestArb
  },
  data() {
    return {
      coins: [],
      coin: '',
      symbols: [],
      quotes: [],
      quote: '',
      noHits: false,
      prices: [],
      loop: null
    }
  },
  mounted() {
    this.getCoins();
  },
  computed: {
    loadQuotes() {
      if (!this.quotes.length) {
        return `Waiting for Gecko...`;
      } else {
        return 'Choose a quote currency';
      }
    }
  },
  methods: {
    arbCheck() {
      if (this.loop) {
        clearInterval(this.loop);
      }
      this.prices.length = 0;

      this.loop = setInterval(() => {
        this.getPrices(this.coin, this.quote);
        console.log(this.prices[0].market.identifier, this.prices[this.prices.length - 1].market.identifier);
      }, 3000);
    },
    async getCoins() {
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
    },
    async getSymbols() {
      let res = await fetch('https://api.coingecko.com/api/v3/coins/list');
      let arrJSON = await res.json();

      let symbols = [];
      arrJSON.forEach(obj => {
        if (this.coins.includes(obj.id)) {
          symbols.push([obj.id, obj.symbol]);
        }
      });

      this.symbols = symbols;
    },
    resetQuotes() {
      clearInterval(this.loop);
      this.quote = '';
      this.prices.length = 0;
      this.noHits = false;
    },
    async getQuotes() {
      this.resetQuotes();

      let res = await fetch(`https://api.coingecko.com/api/v3/coins/${this.coin}/tickers`)
      let arrJSON = await res.json();

      await this.getSymbols(); // [bitcoin, btc] for each coin
      let base = this.symbols.find(sub => sub[0] === this.coin)[1].toUpperCase();

      let quotes = [];
      arrJSON.tickers.forEach(obj => {
        if (obj.base === base) { // base is BTC, not WBTC
          quotes.push(obj.target);
        }
      });

      // remove duplicate currencies
      this.quotes = quotes.filter((quote, idx, src) => src.indexOf(quote) === idx);
    },
    async getPrices(coin, quote) {
      let res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/tickers?depth=true`);
      let arrJSON = await res.json();

      this.prices = arrJSON.tickers.filter(ticker => ticker.target === quote);
      this.prices.sort((a, b) => a.last - b.last);

      if (this.prices.length < 2) {
        this.noHits = true;
        return;
      }

      this.noHits = false;
    }
  }
}
</script>

<style>
  #container {
    width: 320px;
    height: 120px;

    text-align: center;

    border: 1px solid gray;
  }
  img {
    max-width: 50%;
    margin-top: 15px;
  }
  #selects {
    display: flex;
    justify-content: space-evenly;

    margin-top: 10px;
  }
  select {
    height: 25px;
  }
</style>
