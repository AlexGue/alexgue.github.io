

let connection;
let adminMode = false;
window.onload = async function () {

    connection = new WebSocket('wss://bpmnserver.alexgd.es');



    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // if browser doesn't support WebSocket, just show
    // some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>',
            { text: 'Sorry, but your browser doesn\'t support WebSocket.' }
        ));
        input.hide();
        $('span').hide();
        return;
    }



    connection.onopen = function () {
        // first we want users to enter their names

    };

    let lastColored;
    let lastColored2;
    let previousTimeouts = [];


    connection.onmessage = function (message) {

        function moveTo(obj){
            let viewBox = document.querySelector("#mainSvg").viewBox.baseVal
            viewBox.x =obj.x
            viewBox.y = obj.y
            viewBox.height = obj.zoom
            viewBox.width = obj.zoom * 2
        }

        var newObject = JSON.parse(message.data)
        if (newObject.type === 'move') {
         
            if (!adminMode){
                document.getElementById('title').hidden = false;
            }
            
            let viewBox = document.querySelector("#mainSvg").viewBox.baseVal
            let change = Math.abs(viewBox.x - newObject.x) + Math.abs(viewBox.y - newObject.y) + Math.abs(viewBox.height - newObject.zoom);
            if (change > 30){
                let tickMs = 15;
                let duration = 500;
                let ticks = duration/tickMs;
                let current = 0;
                let difX = newObject.x - viewBox.x;
                let difY = newObject.y - viewBox.y;
                let difZoom = newObject.zoom - viewBox.height;
                previousTimeouts.forEach(x=>clearInterval(x))
                previousTimeouts = []
              
                while (current < duration){
                    current += tickMs;
                    actual = (current/duration);
                    let newX = viewBox.x + (difX*actual)
                    let newY = viewBox.y + (difY*actual)
                    let newZoom = viewBox.height + difZoom*actual
                    let obj = {
                        y: newY,
                        x: newX,
                        zoom: newZoom
                    }
                   
                    previousTimeouts.push(setTimeout(moveTo, current, obj))
                }
            }
            else{
                viewBox.x = newObject.x
                viewBox.y = newObject.y
                viewBox.height = newObject.zoom
                viewBox.width = newObject.zoom * 2
            }
          
        } else if (newObject.type === 'color') {
            if (lastColored2){
                document.getElementById(lastColored2).style.fill = 'white'
            }
            if (lastColored){
                document.getElementById(lastColored).style.fill = 'rgb(33 150 243 / 30%)'
                lastColored2 = lastColored;
            }
            document.getElementById(newObject.id).style.fill = '#2196f385'
            lastColored2 = lastColored;
            lastColored = newObject.id;

        } else  if (newObject.type === 'info') {
            console.log('Conectados: ' + newObject.connections)
        }
    }

    connection.onerror = function (error) {
        // just in there were some problems with connection...
        content.html($('<p>', {
            text: 'Sorry, but there\'s some problem with your '
                + 'connection or the server is down.'
        }));
    };
  

    setTimeout(function () {
        document.querySelector("#mainSvg").viewBox.baseVal.x = 1187
        document.querySelector("#mainSvg").viewBox.baseVal.y = 66
        document.querySelector("#mainSvg").viewBox.baseVal.height = 851
        document.querySelector("#mainSvg").viewBox.baseVal.width = 851 * 2
    }, 350)


    let response = await fetch('https://assets.galibo.governify.io/api/v1/public/static/DiagramaFinal2.svg')
    let rtext = await response.text()
    document.getElementById('test').innerHTML = rtext;
}




