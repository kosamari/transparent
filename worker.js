self.onmessage = function (message) {
  console.log(message)
  var img = message.data.img
  var c = message.data.color
  for (var y = 0; y < img.height; y++) {
    for (var x = 0; x < img.width; x++) {
      var i = (x + y * img.width) * 4
      if(img.data[i] === c[0] && img.data[i + 1] === c[1] && img.data[i + 2] === c[2]) {
        img.data[i + 3] =  0
      }
    }
  }
  self.postMessage(img, [img.data.buffer])
}