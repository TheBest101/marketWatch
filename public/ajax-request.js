function ajax(code,callback) {
  var key = 'LVUHANWV3VJ73FH7'
  $.ajax({
    type: "GET",
    async: false,
    url: `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${code}&outputsize=compact&apikey=${key}`,
    success: function(json){
       callback(json)
    }
  });
}
