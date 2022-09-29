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
    const modDiv = document.createElement("div");
    modDiv.id = "formNav";
    const fDiv = document.createElement("main");
    const headDiv = document.createElement("div");
    headDiv.innerHTML = "<span class='closeBtn' onclick=\"closeNav('formNav')\">&times;</span>";
    const tabDiv = document.createElement("div");
    tabDiv.setAttribute("class","tab");
    var texty = "<button class='tabLink' onclick=\"openForm(event,'query')\" id='thisOpen'>Search</button>";
    texty += "<button class='tabLink' onclick=\"openForm(event,'upload')\">Update</button>";
    //fDiv.style.display = "none";
    tabDiv.innerHTML = texty;
    const qryDiv = document.createElement("div");
    qryDiv.setAttribute("class","tabContent");
    qryDiv.innerHTML = "<h2>Search for data into weather DB</h2><p>Enter your account details</p>";

    const uploadDiv = document.createElement("div");
    uploadDiv.setAttribute("class","tabContent");
    uploadDiv.innerHTML = "<h2>Update weather DB</h2><p>Enter your account details</p>";
    window.onclick = function(ev){
        if (ev.target == fDiv){
            fDiv.style.display = "none";
        }
    }
    fDiv.appendChild(headDiv);
    fDiv.appendChild(tabDiv);
    fDiv.appendChild(qryDiv);
    fDiv.appendChild(uploadDiv);
    modDiv.appendChild(fDiv);
    //document.getElementById("thisOpen").click();
    return modDiv;
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