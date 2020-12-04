var firstTime = -1;
var isOff = true;
var limit = 5.0;
var reversed = false;
(function() {
    'use strict';
    const isOn = function(val) {
      if (!reversed) {
        return val > 20
      } else {
        return !(val > 20)
      }
    }


    const onReceived = data => {
        var msgel = document.getElementById('display')
        var subel = document.getElementById('sub')
        var limsec = document.getElementById('limit-sec').value

        let textDecoder = new TextDecoder();
        console.log(textDecoder.decode(data));
        const val = Number(textDecoder.decode(data))

        reversed = document.getElementById('reverse').checked

        if (isOn(val)) {
          let now = new Date()
            if (firstTime === -1) {
              firstTime = new Date()
              msgel.innerHTML = '<button class="btn btn-success btn-lg btn3d">残量あり</button>';
            } else {
              if (now.getTime() - firstTime.getTime() >= 1000 * limsec) {
                msgel.innerHTML = '<button class="btn btn-success btn-lg btn3d active">残量なし</button>';
                isOff = false;
              } else {
                msgel.innerHTML = '<button class="btn btn-success btn-lg btn3d">残量あり</button>';
              }
            }
            subel.innerHTML = `<h2>感知中...${Math.floor((now.getTime() - firstTime.getTime())/1000)}秒</h2>`;
        } else {
            isOff = true;
            firstTime = -1;
            msgel.innerHTML = '<button class="btn btn-success btn-lg btn3d">残量あり</button>';
            subel.innerHTML = '<h2>感知なし</h2>';
        }
    }
  
    var port;
  
    let textEncoder = new TextEncoder();
  
    document.addEventListener('DOMContentLoaded', event => {
      let btn = document.querySelector('#reset');
      var msgel = document.getElementById('display')
      btn.addEventListener('click', function() {
        firstTime = -1;
        isOff = true;
      })

      let connectButton = document.querySelector('#connect');
   
      function connect() {
        console.log('Connecting to ' + port.device_.productName + '...');
        port.connect().then(() => {
          console.log(port);
          console.log('Connected.');
          connectButton.textContent = 'Arduinoとの接続解除';
          port.onReceive = onReceived
          port.onReceiveError = error => {
            console.log('Receive error: ' + error);
          };
        }, error => {
          console.log('Connection error: ' + error);
        });
      };
  
      connectButton.addEventListener('click', function() {
        if (port) {
          port.disconnect();
          connectButton.textContent = 'Arduinoと接続する';
        } else {
          serial.requestPort().then(selectedPort => {
            port = selectedPort;
            connect();
          }).catch(error => {
            console.log('Connection error: ' + error);
          });
        }
      });
  
      serial.getPorts().then(ports => {
        if (ports.length == 0) {
          console.log('No devices found.');
        } else {
          port = ports[0];
          connect();
        }
      });
    });
  })();