# arb

An embeddable widget that returns the top arbitrage trading opportunity for the crypto & quote currency of your choice.

Made with Vue & [vue-custom-element](https://github.com/karol-f/vue-custom-element)

Data provided by CoinGecko

## Using the Widget

To embed the widget on your site, drop in the following html:
```
<arb-widget></arb-widget>
<script src="https://infallible-lichterman-a72efc.netlify.app/js/app.js"></script>
```

Or try the widget [here](https://infallible-lichterman-a72efc.netlify.app/)

Choose a cryptocurrency and a quote currency. The widget returns the best arbitrage opportunity, which it verifies every few seconds. If the opportunity no longer exists or a better one arises, the widget will update.

![loading new opportunity](/src/assets/update-exch.gif)

![loading new opportunity](/src/assets/update-price.gif)

Once in a while, the Access-Control-Allow-Origin header is not present in CoinGecko's response. This rarely happens, but when it does...

![error handling](/src/assets/arb-error.gif)

## Building the Widget
I started with Dana Janoskova's [Vuidget](https://itnext.io/vuidget-how-to-create-an-embeddable-vue-js-widget-with-vue-custom-element-674bdcb96b97), which was very helpful. From there, I got into Shadow DOM, how to deploy CSS & JS as a single file (easier to embed), url redirects (same reason), and QA techniques like throttling, blocking network requests, and testing on different browsers/devices.
