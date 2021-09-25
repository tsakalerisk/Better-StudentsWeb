var head, tbody, main_table_body, main_table_data_body, logoElement

function reformatDocument() {
    //Link Bootstrap
    head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css";
    link.rel = "stylesheet";
    link.crossOrigin = "anonymous";
    link.integrity = "sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU";
    head.insertBefore(link, head.children[0]);

    //Refromat ids and classes
    tbody = document.querySelector("body > table > tbody");

    tbody.children[0].setAttribute("id", "TBodyTitle");
    tbody.children[1].setAttribute("id", "TBodyInv1");
    tbody.children[2].setAttribute("id", "TBodyInv2");
    tbody.children[3].setAttribute("id", "TBodyName");
    tbody.children[4].setAttribute("id", "TBodyDesc");
    tbody.children[5].setAttribute("id", "TBodyMain");
    tbody.children[6].setAttribute("id", "TBodyFooter");


    main_table_body = document.querySelector("#mainTable > tbody");

    main_table_body.children[0].setAttribute("id", "MainTableDropDownRow");
    main_table_body.children[1].setAttribute("id", "MainTableDataRow");

    main_table_data_body = document.querySelector("#MainTableDataRow > td > table > tbody");
    for (row of main_table_data_body.children) {
        if (row.className != "italicHeader" && row.className != "subHeaderBack" && row.childElementCount != 1) {
            row.setAttribute("class", "Subject")
        }
    }

    //Refromat side menu
    var menuItems = document.getElementsByClassName("menuItem");
    for (item of menuItems) {
        var text = item.childNodes[0].nodeValue;
        item.childNodes[0].nodeValue = "";
        var newSpan = document.createElement("div");

        newSpan.textContent = text;
        item.insertBefore(newSpan, item.children[0]);
    }

    var mnuMain = document.getElementById("mnuMain");
    mnuMain.removeAttribute("onclick");
    mnuMain.onclick = function () { newMnuOnClick('mnuMain', 'main.asp') };

    var student = document.getElementById("student");
    student.removeAttribute("onclick");
    student.onclick = function () { newMnuOnClick('student', 'studentMain.asp') };

    var mnu3 = document.getElementById("mnu3");
    mnu3.removeAttribute("onclick");
    mnu3.onclick = function () { newMnuOnClick('mnu3', 'stud_CResults.asp?studPg=1') };

    var diloseis = document.getElementById("diloseis");
    diloseis.removeAttribute("onclick");
    diloseis.onclick = function () { newMnuOnClick('diloseis', '') };
    diloseis.childNodes[1].classList.add("dropdown-toggle");

    var program = document.getElementById("program");
    program.removeAttribute("onClick");
    program.onclick = function () { newMnuOnClick('program', '') };
    program.childNodes[1].classList.add("dropdown-toggle");

    var scholar = document.getElementById("scholar");
    scholar.removeAttribute("onclick");
    scholar.onclick = function () { newMnuOnClick('scholar', 'stud_scholarships.asp?studPg=1') };

    var forms = document.getElementById("forms");
    forms.removeAttribute("onclick");
    forms.onclick = function () { newMnuOnClick('forms', '') };
    forms.childNodes[1].classList.add("dropdown-toggle");

    var mnu7 = document.getElementById("mnu7");
    mnu7.removeAttribute("onclick");
    mnu7.onclick = function () { newMnuOnClick('mnu7', 'disconnect.asp') };

    //Set logo image
    logoElement = document.querySelector("#TBodyTitle > td:nth-child(1) > img");
    logoElement.src = chrome.runtime.getURL('/images/uom_logo.png');
}

function calculateLatestGrades() {
    var classesPassedElement = document.createElement("tr");
    classesPassedElement.innerHTML = `
<div class="alert alert-success" role="alert">
    <h4 class="alert-heading" style='font-size: 1.2rem; font-family: apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";'>
        Μαθήματα που περάσατε
    </h4>
    <hr>
    <ul class="mb-0" style='font-size: .9rem; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";'>
    </ul>
</div>`;

    var classesFailedElement = document.createElement("tr");
    classesFailedElement.innerHTML = `
<div class="alert alert-danger" role="alert">
    <h4 class="alert-heading" style='font-size: 1.2rem; font-family: apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";'>
        Μαθήματα που δεν περάσατε
    </h4>
    <hr>
    <ul class="mb-0" style='font-size: .9rem; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";'>
    </ul>
</div>`;

    const d = new Date();
    var currentExamPeriod;
    var year = d.getFullYear();
    var month = d.getMonth();

    if (month < 5) { //Jan to May
        currentExamPeriod = "ΦΕΒΡ";
    }
    else if (month < 8) { //Jun to Aug
        currentExamPeriod = "ΙΟΥΝ";
    }
    else { //Sep to Dec
        currentExamPeriod = "ΣΕΠΤ";
    }

    currentExamPeriod = currentExamPeriod + (year - 1) + "-" + (year);

    class Subject {
        constructor(name, grade) {
            this.name = name;
            this.grade = grade;
        }
    }
    const classesPassed = [];
    const classesFailed = [];
    for (subject of document.getElementsByClassName("Subject")) {
        var grade = parseInt(subject.children[6].children[0].textContent);
        //Trim whitespaces from the start of subjectName and remove text in parentheses
        var subjectName = subject.children[1].textContent.trimStart().replace(/ *\([^)]*\) */g, "");
        //Remove all whitespaces from examPeriod for easy comparing of values
        var examPeriod = subject.children[7].textContent.replace(/\s+/g, '');
        if (!isNaN(grade) && examPeriod == currentExamPeriod) {
            if (grade >= 5) {
                classesPassed.push(new Subject(subjectName, grade));
            }
            else {
                classesFailed.push(new Subject(subjectName, grade));
            }
        }
    }

    for (subject of classesPassed) {
        var subjectElement = document.createElement("li");
        subjectElement.innerHTML = subject.name + " <b>" + subject.grade + "</b>";
        classesPassedElement.children[0].children[2].appendChild(subjectElement);
    }
    var positionAboveTable = 0;
    if (classesPassed.length != 0) {
        main_table_body.insertBefore(classesPassedElement, main_table_body.children[positionAboveTable]);
        positionAboveTable++;
    }

    for (subject of classesFailed) {
        var subjectElement = document.createElement("li");
        subjectElement.innerHTML = subject.name + " <b>" + subject.grade + "</b>";
        classesFailedElement.children[0].children[2].appendChild(subjectElement);
    }
    if (classesFailed.length != 0) {
        main_table_body.insertBefore(classesFailedElement, main_table_body.children[positionAboveTable]);
    }
}

function newMnuOnClick(id, link) {
    if (link != "") {
        // έλεγχος για το αν υπάρχει ήδη το '?'
        var s = link.indexOf("?");
        if (s != -1)
            link = link + "&mnuid=" + id;
        else
            link = link + "?mnuid=" + id;
        window.open(link, "_self")
    }
    var tableChildren;
    var table = document.getElementById("menuTable");
    tableChildren = table.childNodes[0].childNodes.length;
    var i;
    for (i = 0; i < tableChildren; i++) {
        var td = table.childNodes[0].childNodes[i].childNodes[0];
        if (td.innerHTML != "&nbsp;") {
            if (td.id != id) {
                //Close open submenus
                if (td.childNodes.length > 2) {
                    td.childNodes[2].style.display = "none";
                }
                //Show options (runs on top of mnuOnClick)
                td.childNodes[1].style.display = "";
            }
            else {
                //Show submenu
                if (td.childNodes.length > 2) {
                    td.childNodes[2].style.display = "";
                }
            }
        }
    }
}

reformatDocument();
calculateLatestGrades();