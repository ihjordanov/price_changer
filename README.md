# Price Changer Script

A JavaScript utility that automatically converts Bulgarian Lev (BGN) prices to Euro (EUR) on web pages. The script finds price elements containing "BGN" text and appends the Euro equivalent next to them.

## Features

- Automatically detects BGN prices on page load
- Handles dynamic content changes and URL navigation
- Converts prices using the fixed exchange rate of 1 EUR = 1.95583 BGN
- Formats Euro amounts with proper decimal places
- Prevents duplicate processing of already converted elements
- Works with single-page applications (SPA) and traditional navigation

## Usage

**Important**: This script must be placed right before the closing `</body>` tag in your HTML document:

```html
    <!-- Your page content -->
    <script src="price_changer.js"></script>
  </body>
</html>
```

## How it works

1. **Price Detection**: Uses XPath to find all elements containing "BGN" text
2. **Conversion**: Parses BGN amounts and converts them to EUR using the fixed rate
3. **Display**: Appends the Euro equivalent in format "BGN X,XXX.XX - EUR X,XXX.XX"
4. **Navigation Support**: Monitors URL changes to handle dynamic content loading
5. **Performance**: Uses WeakSet to prevent reprocessing the same elements

## Exchange Rate

The script uses a fixed exchange rate of **1 BGN = 1.95583 EUR** (the official Bulgarian Lev peg to Euro).

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript features
- WeakSet
- XPath evaluation
- History API 