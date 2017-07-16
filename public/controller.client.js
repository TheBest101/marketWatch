var appUrl = window.location.origin;
var socket;
$(document).ready(() => {
  //connection
  socket = io.connect('https://watch-stock-market-alex.herokuapp.com/');
  //on get data
  socket.on('stocks', data => {
    update(data);
  })

  //add data
  $('#basic-addon1').on('click', () => {
    let code = $('#val').val()
    socket.emit('stockAdd', code)
  })
})

function deletes(i) {
  socket.emit('stockDelete', i)
}
function descShortener (str) {
  if(str.length > 80) {
    return str.slice(0, 77) + '...'
  }else{
    return str
  }
}
function update (data) {
  $('#stock').text('')
  data.forEach((v, i) => {
    ajax(v["code"], json => {
      console.log(json)
      var div = `<div class="box col-md-4">
                  <div class="inner-box">
                    <h2>${json["Meta Data"]["2. Symbol"]}</h2>
                    <p>${descShortener(v["desc"])}</p>
                    <btn class="btn btn-danger" onClick="deletes(${i})">Delete</btn>
                  </div>
                </div>`
      $('#stock').append(div)
      data[i] = {
        name: json["Meta Data"]["2. Symbol"],
        data: json["Time Series (Daily)"]
      }
      if(data.length === i) {
        updateGraph(data)
      }
    })
  })
}
function updateGraph(data){
  function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
  var time = Object.keys(data[0].data)
  var dataset = [];
  data.forEach(v => {
    var arr = [];
    Object.keys(v.data).forEach(date => {
      arr.push(v.data[date]["4. close"])
    })
    var obj = {
      label: v.name,
      data: arr,
      borderColor: getRandomRgb(),
      fill: false
    }
    dataset.push(obj)
  })
  var ctx = document.getElementById('graph')
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: time,
      datasets: dataset
    }
  })
}
