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

function openForm(ev, thisForm){
    var idx,tabcontent,tablink;
    tabcontent = document.getElementsByClassName("tabContent");
    for (idx=0; idx <tabcontent.length; idx++){
        tabcontent[idx].style.display = "none";
    }
    tablink = document.getElementsByClassName("tabLink");
    for(idx = 0; idx< tablink.length; idx++){
        tablink[idx].className = tablink[idx].className.replace(" active","");
    }

    document.getElementById(thisForm).style.display = "block";
    ev.currentTarget.className += " active";

}

document.getElementById("default").click();