var head, tbody, main_table_body, main_table_data_body, logoElement, newDataRow

function reformatDocument() {
    //Link Bootstrap
    head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css";
    link.rel = "stylesheet";
    link.crossOrigin = "anonymous";
    link.integrity = "sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU";
    head.insertBefore(link, head.children[0]);

    var chartScript = document.createElement('script');
    chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
    head.appendChild(chartScript);

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

    newDataRow = document.createElement("tr");
    main_table_body.insertBefore(newDataRow, main_table_body.children[0]);
}

function calculateLatestGrades() {
    var classesPassedElement = document.createElement("div");
    classesPassedElement.setAttribute("class", "alert alert-success");
    classesPassedElement.setAttribute("role", "alert");
    classesPassedElement.innerHTML = `
        <h4 class="alert-heading" style='font-size: 1.2rem; font-family: apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";'>
            Μαθήματα που περάσατε
        </h4>
        <hr>
        <ul class="mb-0" style='font-size: .9rem; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";'>
        </ul>`;

    var classesFailedElement = document.createElement("div");
    classesFailedElement.setAttribute("class", "alert alert-danger");
    classesFailedElement.setAttribute("role", "alert");
    classesFailedElement.innerHTML = `
        <h4 class="alert-heading" style='font-size: 1.2rem; font-family: apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";'>
            Μαθήματα που δεν περάσατε
        </h4>
        <hr>
        <ul class="mb-0" style='font-size: .9rem; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";'>
        </ul>`;

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
        //Remove text in parentheses and trim whitespaces from the edges
        var subjectName = subject.children[1].textContent.replace(/ *\([^)]*\) */g, "").trim();
        //Remove all whitespaces from examPeriod for easy comparing of values
        var examPeriod = subject.children[7].textContent.replace(/\s+/g, '');
        if (!isNaN(grade)) {
            if (grade >= 5) {
                if (examPeriod == currentExamPeriod) {
                    classesPassed.push(new Subject(subjectName, grade));
                }
                numPassed++;
            }
            else {
                if (examPeriod == currentExamPeriod) {
                    classesFailed.push(new Subject(subjectName, grade));
                }
                numFailed++;
            }
        }
        else {
            if (subject.children[6].style.textDecoration != "line-through") {
                numNotGraded++;
            }
        }
    }

    var parent = document.createElement("td");
    parent.style.width = "50%";
    newDataRow.appendChild(parent);

    for (subject of classesPassed) {
        var subjectElement = document.createElement("li");
        subjectElement.innerHTML = subject.name + "&nbsp;<b>" + subject.grade + "</b>";
        classesPassedElement.children[2].appendChild(subjectElement);
    }
    parent.appendChild(classesPassedElement);

    for (subject of classesFailed) {
        var subjectElement = document.createElement("li");
        subjectElement.innerHTML = subject.name + "&nbsp;<b>" + subject.grade + "</b>";
        classesFailedElement.children[2].appendChild(subjectElement);
    }
    //if (classesFailed.length != 0) {
    parent.appendChild(classesFailedElement);
    //}
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

var numPassed = 0, numFailed = 0, numNotGraded = 0;
reformatDocument();
calculateLatestGrades();
var doughnutParent = document.createElement("td");
doughnutParent.innerHTML = `
    <div style="margin-left: 10px; padding: 8px;">
        <div style="width:100%; height: 250px">
            <canvas id="subjectChart">
            </canvas>
        </div>
    </div>`;
doughnutParent.style.width = "50%";
newDataRow.appendChild(doughnutParent);

const data = {
    labels: [
        'Περασμένα Μαθήματα',
        'Μαθήματα χωρίς βαθμό',
        'Κομμένα μαθήματα'
    ],
    datasets: [{
        label: 'My First Dataset',
        data: [numPassed, numNotGraded, numFailed],
        backgroundColor: [
            '#d4edda',
            '#fff3cd',
            '#f8d7da'
        ],
        hoverOffset: 4
    }]
};

const config = {
    type: 'doughnut',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
};

var subjectChart = new Chart(
    document.getElementById('subjectChart'),
    config
);

