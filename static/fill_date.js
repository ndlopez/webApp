document.body.appendChild(addFormModal());

function getDate(){
    const heute = new Date();
    const monty = heute.getMonth() + 1;
    const tag = heute.getDay();
    //var myOpt = document.getElementById("monty");
    console.log(monty+tag);
    //return monty+tag;
}

/*function buildOpt(thisId){
    const selDiv = document.getElementById(thisId);
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
    return selDiv;
}*/

function openNav(){
    document.getElementById("formNav").style.display = "block";
    document.body.style.overflow = "hidden";
}
function closeNav(myForm){
    document.getElementById(myForm).style.display = "none";
    document.body.style.overflow = "auto";
}
function addFormModal(){
    const fDiv = document.createElement("div");
    fDiv.id = "formNav";
    //fDiv.style.display = "none";
    fDiv.innerHTML ="<div class='cleafix'><p>My modal</p></div>";
    window.onclick = function(ev){
        if (ev.target == fDiv){
            fDiv.style.display = "none";
        }
    }
    return fDiv;
}

function openForm(ev, thisForm){//, thisTag
    //buildOpt(thisTag);
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

//document.getElementById("thisOpen").click();