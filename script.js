let showVal;
let showVal2;
let showVal3;

let connection;
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

    connection.onmessage = function (message) {

        var newObject = JSON.parse(message.data)
        console.log(newObject)
        if (newObject.type === 'move') {
            document.querySelector("#mainSvg").viewBox.baseVal.x = newObject.x
            document.querySelector("#mainSvg").viewBox.baseVal.y = newObject.y
            document.querySelector("#mainSvg").viewBox.baseVal.height = newObject.zoom
            document.querySelector("#mainSvg").viewBox.baseVal.width = newObject.zoom * 2
        } else if (newObject.type === 'color') {
            if (lastColored){
                document.getElementById(lastColored).style.fill = 'white'
            }
            document.getElementById(newObject.id).style.fill = '#2196f385'
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
    let currentObject = {
        type: 'move',
        x: 1187,
        y: 66,
        zoom: 851,
    }

    setTimeout(function () {
        document.querySelector("#mainSvg").viewBox.baseVal.x = 1187
        document.querySelector("#mainSvg").viewBox.baseVal.y = 66
        document.querySelector("#mainSvg").viewBox.baseVal.height = 851
        document.querySelector("#mainSvg").viewBox.baseVal.width = 851 * 2
    }, 100)
    showVal = function showVal(val) {
        currentObject.x = val
        connection.send(JSON.stringify(currentObject))
    }
    showVal2 = function showVal(val) {
        currentObject.y = val
        connection.send(JSON.stringify(currentObject))
    }
    showVal3 = function showVal(val) {
        currentObject.zoom = val
        connection.send(JSON.stringify(currentObject))

    }

    let response = await fetch('https://assets.galibo.governify.io/api/v1/public/static/DiagramaFinal2.svg')
    let rtext = await response.text()
    document.getElementById('test').innerHTML = rtext;
}




