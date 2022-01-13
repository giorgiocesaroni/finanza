import accounting from "accounting";

// Settings
accounting.settings = {
  currency: {
    symbol: "$",   // default currency symbol is '$'
    decimal: ".",  // decimal point separator
    thousand: ",",  // thousands separator
    precision: 2   // decimal places
  },
  number: {
    precision: 0,  // default precision on numbers is 0
    thousand: ",",
    decimal: "."
  }
}

accounting.settings.currency.format = {
  pos: "%s %v",   // for positive values, eg. "$ 1.00" (required)
  neg: "%s (%v)", // for negative values, eg. "$ (1.00)" [optional]
  zero: "%s --"  // for zero values, eg. "$  --" [optional]
};

export default accounting;