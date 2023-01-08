/*!
 * 
 *
 * Copyright 2015 Dr.R.Urban
 * Released under the MIT license
 * https://github.com/antiproton
 *
 * Date: 25.5.2015
 */
	var request = false;

	// Request senden
	function setRequest(value) {
		// Request erzeugen
		if (window.XMLHttpRequest) {
			request = new XMLHttpRequest(); // Mozilla, Safari, Opera
		} else if (window.ActiveXObject) {
			try {
				request = new ActiveXObject('Msxml2.XMLHTTP'); // IE 5
			} catch (e) {
				try {
					request = new ActiveXObject('Microsoft.XMLHTTP'); // IE 6
				} catch (e) {}
			}
		}

		// überprüfen, ob Request erzeugt wurde
		if (!request) {
			alert("Kann keine XMLHTTP-Instanz erzeugen");
			return false;
		} else {
			var url = "bot.php";
			// Request öffnen
			request.open('post', url, true);
			// Requestheader senden
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			// Request senden
			request.send('fen='+value);
			// Request auswerten
			request.onreadystatechange = interpretRequest;
		}
	}

	// Request auswerten
	function interpretRequest() {
		switch (request.readyState) {
			// wenn der readyState 4 und der request.status 200 ist, dann ist alles korrekt gelaufen
			case 4:
				if (request.status != 200) {
					alert("Der Request wurde abgeschlossen, ist aber nicht OK\nFehler:"+request.status);
				} else {
					 content = request.responseText;
					// den Inhalt des Requests in das <div> schreiben
					//document.getElementById('content').innerHTML = content;
				}
				break;
			default:
				break;
		}
	}