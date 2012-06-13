function parseDouble(value){
  if(typeof value == "string") {
    value = value.match(/^-?\d*/)[0];
  }

  return !isNaN(parseInt(value)) ? value * 1 : NaN;
}