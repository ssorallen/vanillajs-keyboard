(function(){
    var keyboard = window.keyboard = function(){
        return new keyboard.fn.init();
    };
    function pageX(elem) {
        return elem.offsetParent ?
            elem.offsetLeft + pageX(elem.offsetParent) :
            elem.offsetLeft;
    }
    function pageY(elem) {
        return elem.offsetParent ?
            elem.offsetTop + pageY(elem.offsetParent) :
            elem.offsetTop;
    }

    keyboard.fn = keyboard.prototype = {
        lowerchars: [
            ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
            ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
            ["⟰", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/"]
        ],
        chars: [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\""],
            ["⟱", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "?"]
        ],
        init: function() {
            var table = document.createElement("table");
            table.id = "keyboard";

            keyboard.fn.populateTable(table, keyboard.fn.lowerchars);

            var content = document.getElementById("content");
            content.appendChild(table);

            var textarea = document.createElement("textarea");
            textarea.cols = "55";
            textarea.rows = "10";
            textarea.id = "text";
            textarea.setAttribute("readonly", "readonly");
            content.appendChild(textarea);

            var clearButton = document.createElement("input");
            clearButton.value = "Clear";
            clearButton.type = "button";
            clearButton.onclick = function() {
                textarea.value = "";
            };
            content.appendChild(clearButton);

            keyboard.fn.attachListeners(table);
        },
        populateTable: function(table, chars) {
            var maxLength = keyboard.fn.findLongestRow(keyboard.fn.lowerchars);

            for(var i = 0; i < keyboard.fn.lowerchars.length; i++) {
                var tr = document.createElement("tr");
                var rowChars = keyboard.fn.lowerchars[i];
                var extraCells = maxLength - keyboard.fn.lowerchars[i].length;

                for(var j = 0; j < rowChars.length; j++) {
                    var td = document.createElement("td");
                    if(rowChars[j] == "⟰") td.id = "shift";
                    td.appendChild(document.createTextNode(rowChars[j]));
                    tr.appendChild(td);
                }

                for(var k = 0; k < extraCells; k++) {
                    var td = document.createElement("td");
                    td.className = "empty";
                    tr.appendChild(td);
                }

                table.appendChild(tr);
            }
        },
        setTableContent: function(table, chars) {
            var x = 0, y = 0;
            for(var i = 0; i < table.childNodes.length; i++) {
                var row = table.childNodes[i];
                if(row && row.nodeName == "TR") {
                    var l = row.childNodes.length;
                    for(var j = 0; j < l; j++) {
                        var cell = row.childNodes[j];
                        if(cell && cell.nodeName == "TD") {
                            var newchar = chars[x][y];
                            if(newchar == "⟰") cell.id = "shift";
                            else if(newchar == "⟱") cell.id = "unshift";

                            if(!/empty/.test(cell.className)) cell.textContent = newchar;
                            y++;   
                        }
                    }
                    x++;
                    y = 0;
                }
            }
        },
        findLongestRow: function(chars) {
            var l = 0;
            for(var i = 0; i < chars.length; i++) {
                if(chars[i].length > l) l = chars[i].length;
            }
            return l;
        },
        attachListeners: function(table) {
            table.onmouseover = function(e) {
                // Standardize for IE
                e = e || window.event;

                // Find correct target element
                var t = e.target || e.srcElement;

                if(t && t.nodeName == "TD" && !/empty/.test(t.className)) {
                    keyboard.fn.magnify(t);
                }
            };
            table.onmouseout = function(e) {
                e = e || window.event;
                var t = e.target || e.srcElement;

                if(t && t.nodeName == "TABLE") {
                    keyboard.fn.demagnify(t);
                }
            };
        },
        click: function(e) {
            var t = document.getElementById("text");
            t.value += this.textContent || this.innerText;
        },
        shift: function(e) {
            var table = document.getElementById("keyboard"),
                hdiv = document.getElementById("highlight");
            keyboard.fn.setTableContent(table, keyboard.fn.chars);

            hdiv.innerHTML = "⟱";
            hdiv.onclick = keyboard.fn.unshift;
        },
        unshift: function(e) {
            var table = document.getElementById("keyboard"),
                hdiv = document.getElementById("highlight");
            keyboard.fn.setTableContent(table, keyboard.fn.lowerchars);
            
            hdiv.innerHTML = "⟰";
            hdiv.onclick = keyboard.fn.shift;
        },
        magnify: function(t) {
            var hdiv = document.getElementById("highlight");
            if(!hdiv) {
                hdiv = document.createElement("div");
                hdiv.style.display = "none";
                hdiv.id = "highlight";
                hdiv.style.position = "absolute";
                document.body.appendChild(hdiv);
            }

            if(t.id == "shift") {
                hdiv.onclick = keyboard.fn.shift;
            } else if(t.id == "unshift") {
                hdiv.onclick = keyboard.fn.unshift;
            } else {
                hdiv.onclick = keyboard.fn.click;
            }

            // Set hover content to actual content
            if(hdiv.firstChild) hdiv.removeChild(hdiv.firstChild);
            hdiv.appendChild(t.firstChild.cloneNode(true));

            // Add self-closing event handler
            hdiv.onmouseout = keyboard.fn.demagnify;

            var divWidth = hdiv.offsetWidth;
            if(divWidth == 0) {
                hdiv.style.top = "-9999px";
                hdiv.style.left = "-9999px";
                hdiv.style.display = "block";
                divWidth = hdiv.offsetWidth;
            }

            var x = (divWidth - t.offsetWidth) / 2;

            // Find new positioning for hover content
            hdiv.style.top = pageY(t) - x + "px";
            hdiv.style.left = pageX(t) - x  + "px";
            hdiv.style.display = "block";
        },
        demagnify: function(t) {
            var h = document.getElementById("highlight");
            h.style.display = "none";
            h.onmouseout = undefined;
        }
    };

    window.onload = function() {
        var k = new keyboard();
    };
})();
