const selDiv = document.getElementById("tag");
const optElm = document.createElement("option");
optElm.innerText = "Day";
selDiv.appendChild(optElm);
for(let idx=1; idx<=31;idx++){
    var strIdx = idx;
    var el = document.createElement("option");
    if(idx < 10){
        strIdx = "0"+idx;
    }
    el.setAttribute("value",strIdx);
    el.innerText = strIdx;
    selDiv.appendChild(el);
}
