<template>
  <div id="container">
    <div id="selects">
      <select @change="getQuotes()" v-model="coin">
        <option disabled value="">Choose a coin</option>
        <option
          v-for="coin in coins"
          :key="coin"
        >
        {{ coin }}
        </option>
      </select>

      <select @change="arbCheck()" v-model="quote">
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
      <div v-if="!coins.length">
        <!-- https://www.coingecko.com/en/branding -->
        <img src="../public/gecko.webp" alt="CoinGecko logo">
      </div>
      <div v-else-if="coin && !quote">
        <p>{{ loadQuotes }}</p>
      </div>
      <div v-else-if="coin && quote && !prices.length">
        <p>Waiting for Gecko...</p>
      </div>
      <div v-else-if="coin && quote && noHits">
        <p>No opportunities. Try a different quote currency.</p>
      </div>
      <div v-else>
        <best-arb
          v-if="loaded"
          :perc="perc"
          :logos="logos"
          :loEx="loEx"
          :loLast = "loLast"
          :hiEx="hiEx"
          :hiLast = "hiLast"
        >
        </best-arb>
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
      perc: '',
      logos: [],
      loEx: '',
      loLast: '',
      loId: '',
      hiEx: '',
      hiLast: '',
      hiId: '',
      loaded: false,
      loop: null,
      int: 3000 // will be set by the user
    }
  },
  mounted() {
    this.getCoins();
  },
  computed: {
    loadQuotes() {
      if (!this.quotes.length) {
        return `Waiting for Gecko...`; // waiting for quote currencies to populate
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
        this.getArb(this.coin, this.quote);
        console.log(`latest opportunity: ${this.loEx}, ${this.hiEx}, ${this.perc}`);
      }, this.int);
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
    resetOutput() { // new coin, populate quote currencies
      clearInterval(this.loop);
      this.quote = '';
      this.prices.length = 0;
      this.noHits = false;
    },
    async getQuotes() {
      this.resetOutput();

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

      // remove duplicate quote currencies
      this.quotes = quotes.filter((quote, idx, src) => src.indexOf(quote) === idx);
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
        this.loaded = false;
        this.loId = low.market.identifier;
        this.hiId = high.market.identifier;
        this.logos = [];

        await this.getLogos(low.market.identifier);
        await this.getLogos(high.market.identifier);
      }

      this.perc = `${(((this.hiLast - this.loLast) / this.loLast) * 100).toFixed(4)}%`;
      this.loEx = this.truncateExchange(low.market.name);
      this.hiEx = this.truncateExchange(high.market.name);

      this.loaded = true;
    },
    async getArb(coin, quote) {
      let res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/tickers?depth=true`);
      let arrJSON = await res.json();

      this.prices = arrJSON.tickers.filter(ticker => ticker.target === quote);
      this.prices.sort((a, b) => a.last - b.last);

      if (this.prices.length < 2) {
        this.noHits = true;
        return;
      }

      this.noHits = false;
      await this.getDetails();
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
    margin-top: 10px;
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
