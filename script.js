function getSelectedText() {
  var text = "";
  if (typeof window.getSelection != "undefined") {
    text = window.getSelection().toString();
  } else if (
    typeof document.selection != "undefined" &&
    document.selection.type == "Text"
  ) {
    text = document.selection.createRange().text;
  }
  return text;
}

function doSomethingWithSelectedText(e) {
  var selectedText = getSelectedText();
  if (!selectedText.toString().trim().length) {
    removePopup();
    return;
  }

  if (selectedText && isNumeric(selectedText)) {
    const x = e.clientX;
    const y = e.clientY;
    const currencyVal = getCurrency();
    const calculatedCurrency = calculateCurrency(currencyVal, selectedText); 

    placePopup(x, y, calculatedCurrency);
  }
}

let currValueofFetchData;

function getCurrency() {
    const url = "https://api.genelpara.com/embed/doviz.json";
    
    chrome.runtime.sendMessage( //goes to bg_page.js
        url,
        data => {
          currValueofFetchData = data.USD.satis;
        // data => {console.log(data.USD.satis);}
        }
    );
    currValueofFetchData = parseFloat(currValueofFetchData);
    return currValueofFetchData;
}

function calculateCurrency(currencyVal, selectedText) {
    return currencyVal*selectedText;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function placePopup(x_pos, y_pos, calculatedCurrency) {
  const d = document.getElementById("popup_converter8255");
  d.style.position = "fixed";
  d.style.left = x_pos + "px";
  d.style.top = y_pos + "px";
  d.innerText = calculatedCurrency.toFixed(2) + " TL";
  d.style.display = "block";

}

function removePopup() {
  const d = document.getElementById("popup_converter8255");
  d.style.display = "none";
}

function createPopupElement() {
  const popup8255 = document.createElement("div");
  if (popup8255.length < 0) {
    return;
  }
  popup8255.setAttribute("id", "popup_converter8255");
  document.body.appendChild(popup8255);
}

setTimeout(createPopupElement, 1000);

document.onmouseup = doSomethingWithSelectedText;

// document.onkeyup = doSomethingWithSelectedText;
