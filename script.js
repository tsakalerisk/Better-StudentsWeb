var head = document.getElementsByTagName('head')[0];

var link = document.createElement('link');
link.href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css";
link.rel="stylesheet";
link.crossOrigin="anonymous";
link.integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU";
head.insertBefore(link, head.children[0]);

var tbody = document.querySelector("body > table > tbody");

tbody.children[0].setAttribute("id", "TBodyTitle");
tbody.children[1].setAttribute("id", "TBodyInv1");
tbody.children[2].setAttribute("id", "TBodyInv2");
tbody.children[3].setAttribute("id", "TBodyName");
tbody.children[4].setAttribute("id", "TBodyDesc");
tbody.children[5].setAttribute("id", "TBodyMain");
tbody.children[6].setAttribute("id", "TBodyFooter");


var main_table_body = document.querySelector("#mainTable > tbody");

main_table_body.children[0].setAttribute("id", "MainTableDropDownRow");
main_table_body.children[1].setAttribute("id", "MainTableDataRow");

var main_table_data_body = document.querySelector("#MainTableDataRow > td > table > tbody");
for (row of main_table_data_body.children) {
    if (row.className != "italicHeader" && row.className != "subHeaderBack" && row.childElementCount != 1) {
        row.setAttribute("class", "Subject")
    }
}

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
    var subjectName = subject.children[1].textContent.trimStart();
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
    subjectElement.innerHTML= subject.name + " <b>" + subject.grade + "</b>";
    classesPassedElement.children[0].children[2].appendChild(subjectElement);
}
var positionAboveTable = 0;
if (classesPassed.length != 0) {
    main_table_body.insertBefore(classesPassedElement, main_table_body.children[positionAboveTable]);
    positionAboveTable++;
}

for (subject of classesFailed) {
    var subjectElement = document.createElement("li");
    subjectElement.innerHTML= subject.name + " <b>" + subject.grade + "</b>";
    classesFailedElement.children[0].children[2].appendChild(subjectElement);
}
if (classesFailed.length != 0) {
    main_table_body.insertBefore(classesFailedElement, main_table_body.children[positionAboveTable]);
}

var logoElement = document.querySelector("#TBodyTitle > td:nth-child(1) > img")[0];
