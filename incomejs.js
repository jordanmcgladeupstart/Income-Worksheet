function openTab(str, btn){
    var i;
    var x = document.getElementsByClassName("tab");
    for(i=0; i<x.length; i++){
        x[i].style.display = "none";
    }
    document.getElementById(str).style.display = "block";
    var y = document.getElementsByClassName("tablink");
    for(i=0; i<y.length; i++){
        y[i].className = y[i].className.replace(" active", "");
    }
    btn.className += " active";
    
}

// populate pay periods table with 10 new prompts for user to fill out
// pay period options: [weekly, bi-weekly, semi-monthly, monthly]
// semi-monthly pay periods will end on the 15th and last day of the month
function getNewPayPeriods(){
    var table = document.getElementById("payPeriodsTable");
    while(table.rows.length > 1){
        table.deleteRow(1);
    }
    var row, cell1, cell2, cell3, cell4;
    var i;
    for(i=0; i<10; i++){
        row = table.insertRow(i+1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell4 = row.insertCell(3);

        let payPeriods = ["weekly", "bi-weekly", "semi-monthly", "monthly"];
        let randomPayPeriod = payPeriods[Math.floor(Math.random() * payPeriods.length)].trim();
        let date = getRandomDate(randomPayPeriod);
        let payDate = getPayDate(date, randomPayPeriod);
        let pdEndDate = lastBusinessDate(payDate);

        cell1.innerHTML = "<select id='payPeriodOption" + row.rowIndex + "' onchange='checkPayFrequency(\""+randomPayPeriod+"\", \"payPeriodOption" + row.rowIndex + "\")'><option value='default'>What is the pay period?</option><option value='weekly'>Weekly</option><option value='bi-weekly'>Bi-Weekly</option><option value='semi-monthly'>Semi-Monthly</option><option value='monthly'>Monthly</option></select>";
        cell2.innerHTML = date;
        cell3.innerHTML = pdEndDate;
        cell4.innerHTML = payDate;
        
    }

}

// get random date between 1/1/2019 and 12/31/2023
// if pp is semi-monthly, date will be either 1st or 15th day of month
function getRandomDate(pp){
    let date = new Date();
    let year = Math.floor(Math.random() * 5) + 2019;
    let month = Math.floor(Math.random() * 12) + 1;
    let day;
    if(pp == "semi-monthly"){
        let pick = [1, 15];
        day = pick[Math.floor(Math.random() * 2)];
    }
    else{
        day = Math.floor(Math.random() * 28) + 1;
    }
    date.setFullYear(year, month, day);
    return month + "/" + day + "/" + year;
}

// get pay date based on pay period
function getPayDate(date, payPeriod){
    let payDate = new Date(date);
    if(payPeriod == "weekly"){
        payDate.setDate(payDate.getDate() + 7);
    }
    else if(payPeriod == "bi-weekly"){
        payDate.setDate(payDate.getDate() + 14);
    }
    else if(payPeriod == "semi-monthly"){
        payDate.setDate(payDate.getDate() + 15);
    }
    else if(payPeriod == "monthly"){
        payDate.setMonth(payDate.getMonth() + 1);
    }
    let month = payDate.getMonth() + 1;
    let day = payDate.getDate();
    let year = payDate.getFullYear();
    return month + "/" + day + "/" + year;
}

// get last business day before pay date
function lastBusinessDate(payDate){
    let pd = new Date(payDate);
    let day = pd.getDay();
    if(day == 0){
        pd.setDate(pd.getDate() - 2);
    }
    else if(day == 6){
        pd.setDate(pd.getDate() - 1);
    }
    let month = pd.getMonth() + 1;
    let date = pd.getDate();
    let year = pd.getFullYear();
    return month + "/" + date + "/" + year;
}

// check if pay frequency matches pay period
function checkPayFrequency(pp, id){
    let payFrequency = document.getElementById(id).value;
    if(payFrequency != pp){
        let row = document.getElementById(id).parentNode.parentNode;
        row.style.backgroundColor = "rgb(255, 200, 200)";
    }
    else {
        let row = document.getElementById(id).parentNode.parentNode;
        row.style.backgroundColor = "rgb(200, 255, 200)";
    }
}

// load tables on document ready
$(document).ready(function(){
    getNewPayPeriods();
    paystubGenerator();
});

// Check if user has entered all correct information in pay frequency table
function checkPayFrequency2(){
    var table = document.getElementById("payFrequencyTable");
    for(let r of table.rows){
        if(r.rowIndex == 0) continue;
        for(let c of r.cells){
            if(c.cellIndex==0) continue;
            let value = c.firstChild.value;
            let answer = JSON.parse(c.firstChild.getAttribute("answer"));
            if(value == undefined || value == ""){
                c.style.backgroundColor = "";
            }else if(typeof(answer) == "object"){
                if(answer.includes(Number(value))){
                    c.style.backgroundColor = "rgb(200, 255, 200)";
                }else{
                    c.style.backgroundColor = "rgb(255, 200, 200)";
                }
            }else{
                if(answer == value){
                    c.style.backgroundColor = "rgb(200, 255, 200)";
                }else{
                    c.style.backgroundColor = "rgb(255, 200, 200)";
                }
            }
            
        }
    }

}

// Fill paystubDiv with randomly generated paystub information
function paystubGenerator() {
    var regincome = Math.floor(Math.random()*130000)+5000;
    var commission = (Math.floor(Math.random()* 20000) + 2000)*(Math.random() < .25);
    var tips = (Math.floor(Math.random()* 20000) + 2000)*(Math.random() < .25);
    var vaca = (Math.floor(Math.random()* 5000) + 1000)*(Math.random() > .25);
    var sick = (Math.floor(Math.random()* 5000) + 1000)*(Math.random() > .25);
    var holiday = (Math.floor(Math.random()* 5000) + 1000)*(Math.random() > .25);
    var shiftdif = (Math.floor(Math.random()* 5000) + 1000)*(Math.random() < .15);
    var bonus = (Math.floor(Math.random()* 15000) + 3000)*(Math.random() < .45);
    var perdiem = (Math.floor(Math.random()* 1000) + 500)*(Math.random() < .15);
    var stipend = (Math.floor(Math.random()* 1000) + 700)*(Math.random() < .15);
    var overtime = (Math.floor(Math.random()* 5000) + 2500)*(Math.random() < .75);

    var reported_salary = Math.floor((Math.random()*.5+.75)*(regincome+commission+tips+vaca+sick+holiday+bonus+shiftdif+perdiem+stipend)/100)*100

    var date1 = new Date('2023-04-01').getTime();
    var date2 = new Date('2023-11-30').getTime();
    var date3 = new Date('2020-01-01').getTime();


    var paydate = new Date(Math.random()*(date2-date1)+date1);
    var payperiod = 0
    switch(Math.floor(Math.random()*4)){
        case 0:
        payperiod = 7;
        break;
        case 1:
        payperiod = 14;
        break;
        case 2: 
        payperiod = 15;
        break;
        case 3: 
        payperiod = 30;
        break;
        case 4: 
        payperiod = 14;
        break;
    }
    if(payperiod == 15){
        paydate.setDate(15);
        var startdate = new Date();
        startdate.setTime(paydate.getTime());
        startdate.setDate(1);
    } else if(payperiod == 30){
        paydate.setDate(1);
        var startdate = new Date();
        startdate.setTime(paydate.getTime()-30*(24*60*60*1000));
        startdate.setDate(1);
    }else{
        var startdate = new Date();
        startdate.setTime(paydate.getTime()-payperiod*(24*60*60*1000));
    }
    var jobstartdate = new Date(Math.random()*(date1-date3)+date3);



    co_name = randomNameGenerator(7, 9);
    var suffix = [' Company', ' Industries', ' Co.', ' LLC', ' Enterprises', ' Services']
    co_name += suffix[Math.floor(Math.random()*suffix.length)]

    var job_titles = ['Manager', 'Laborer', 'Associate', 'Vice President', 'CSR', 'Barista', 'Driver', 'Sponsored Athlete', 'Captain', 'Lawyer', 'Part-time Model', 'Used Car Salesman', 'Singer-Songwriter', 'Jester', 'Secretary', 'Judge', 'Underwater Welder', 'Marketing', 'Sailor', 'Editor', 'Cellist', 'Typist', 'Chef', 'Dog Trainer', 'Orthodontist', 'Private Investigator', 'Analyst', 'Agent', 'Ambassador', 'Importer/Exporter', 'Architect']
    var job_title = job_titles[Math.floor(Math.random()*job_titles.length)]

    var apl_name = randomNameGenerator(6,7) + " " + randomNameGenerator(6,10);

    // Annualized earnings + other data
    var job_object = {
        'Regular': regincome,
        'Commission': commission,
        'Tips': tips,
        'Vacation': vaca,
        'Sick': sick,
        'Holiday': holiday,
        'Bonus': bonus,
        'Weekends': shiftdif,
        'PerDiem': perdiem,
        'Stipend': stipend,
        'Overtime': overtime,
        'PeriodStartDate': startdate,
        'PayDate': paydate,
        'JobStartDate': jobstartdate,
        'Company': co_name,
        'Payperiod': payperiod,
        'Applicant': apl_name,
        'JobTitle': job_title,
        'ReportedSalary': reported_salary

    }
    var jan1 = new Date('2023-01-01').getTime();
    var pay_pd_num = Math.floor((paydate.getTime()-jan1)/(payperiod))/(60*60*24*1000);


    var annual_earnings_object = {
        'Regular': regincome*pay_pd_num/52,
        'Commission': commission*pay_pd_num/52,
        'Tips': tips*pay_pd_num/52,
        'Vacation': vaca*pay_pd_num/52,
        'Sick': sick*pay_pd_num/52,
        'Holiday': holiday*pay_pd_num/52,
        'Bonus': bonus*pay_pd_num/52,
        'Weekends': shiftdif*pay_pd_num/52,
        'PerDiem': perdiem*pay_pd_num/52,
        'Stipend': stipend*pay_pd_num/52,
        'Overtime': overtime*pay_pd_num/52
    }


    var pay_pd_num = Math.floor((paydate.getTime()-jan1)/(payperiod))/(60*60*24*1000);


    switch(Math.floor(Math.random()*5)){
        case 0:

        var regh = 1;
        var sickh = 0;
        var vacah = 0;
        var commh = 1;
        var tiph = 1;
        var holh = 0;
        var bonh = 0;
        var wkh = 0;
        var perdh=0;
        var stiph = 0;
        var oth = 1;

        break;
        case 1:

        var regh = .8;
        var sickh = .2;
        var vacah = 0;
        var commh = 0;
        var tiph = 0;
        var holh = 0;
        var bonh = 1;
        var wkh = 0;
        var perdh=0;
        var stiph = 0;
        var oth = 0;
        
        break;
        case 2: 
        
        var regh = .6;
        var sickh = 0;
        var vacah = .2;
        var commh = 0;
        var tiph = 1;
        var holh = .2;
        var bonh = 0;
        var wkh = 1;
        var perdh=1;
        var stiph = 0;
        var oth = 0;
        
        break;
        case 3: 

        var regh = 1;
        var sickh = 0;
        var vacah = 0;
        var commh = 1;
        var tiph = 1;
        var holh = 0;
        var bonh = 1;
        var wkh = 0;
        var perdh=0;
        var stiph = 0;
        var oth = 0;

        break;
        case 4: 

        var regh = 1;
        var sickh = 0;
        var vacah = 0;
        var commh = 0;
        var tiph = 1;
        var holh = 0;
        var bonh = 0;
        var wkh = 0;
        var perdh=0;
        var stiph = 1;
        var oth = 1;

        break;

        case 5: 

        var regh = .8;
        var sickh = 0;
        var vacah = .2;
        var commh = 1;
        var tiph = 1;
        var holh = 0;
        var bonh = 1;
        var wkh = 0;
        var perdh=0;
        var stiph = 1;
        var oth = 1;

        break;
    }

    var current_earnings_object = {
        'Regular': Math.min(regincome/(365/payperiod)*regh, regincome*pay_pd_num/52),
        'Commission': Math.min(commission/(365/payperiod)*commh, commission*pay_pd_num/52),
        'Tips': Math.min(tips/(365/payperiod)*tiph, tips*pay_pd_num/52),
        'Vacation': Math.min(Math.floor(vaca/(365/payperiod)*vacah)*8, vaca*pay_pd_num/52),
        'Sick': Math.min(Math.floor(sick/(365/payperiod)*sickh)*8, sick*pay_pd_num/52),
        'Holiday': Math.min(Math.floor(holiday/(365/payperiod)*holh)*8, holiday*pay_pd_num/52),
        'Bonus': Math.min(bonus/(365/payperiod)*bonh, bonus*pay_pd_num/52),
        'Weekends': Math.min(Math.floor(shiftdif/(365/payperiod)*wkh)*8, shiftdif*pay_pd_num/52),
        'PerDiem': Math.min(perdiem/(365/payperiod)*perdh, perdiem*pay_pd_num/52),
        'Stipend': Math.min(stipend/(365/payperiod)*stiph, stipend*pay_pd_num/52),
        'Overtime': Math.min(overtime/(365/payperiod)*oth, overtime*pay_pd_num/52)
    }

    var metadata = metadataGenerator();
    
    // Populate the paystubDiv with the generated data
    var companyName = document.getElementById("companyName");
    companyName.innerHTML = co_name;
    var companyAddress = document.getElementById("companyAddress");
    companyAddress.innerHTML = "123 Main St, Anytown, USA";
    var companyPhone = document.getElementById("companyPhone");
    companyPhone.innerHTML = "(555) 555-5555";
    var employeeName = document.getElementById("employeeName");
    employeeName.innerHTML = apl_name;
    var employeeAddress = document.getElementById("employeeAddress");
    employeeAddress.innerHTML = "456 Main St, Anytown, USA";
    var employeePhone = document.getElementById("employeePhone");
    employeePhone.innerHTML = "(444) 444-4444";
    var paystubEarnings = document.getElementById("paystubEarnings");
    var paystubNetPay = document.getElementById("paystubNetPay");
    var startDatePaystub = document.getElementById("startDatePaystub");
    startDatePaystub.innerHTML = startdate.toLocaleDateString();
    var endDatePaystub = document.getElementById("endDatePaystub");
    endDatePaystub.innerHTML = paydate.toLocaleDateString();
    var payDatePaystub = document.getElementById("payDatePaystub");
    payDatePaystub.innerHTML = paydate.toLocaleDateString();

    // Reset earnings, deductions, and net pay tables
    while(paystubEarnings.rows.length > 1){
        paystubEarnings.deleteRow(1);
    }
    while(paystubNetPay.rows.length > 1){
        paystubNetPay.deleteRow(1);
    }
    var paystubDeductions = document.getElementById("paystubDeductions");
    while(paystubDeductions.rows.length > 1){
        paystubDeductions.deleteRow(1);
    }
    console.log(current_earnings_object);
    for(let key in current_earnings_object){
        if(current_earnings_object[key] == 0) continue;
        let row = paystubEarnings.insertRow();
        let cell1 = row.insertCell(0); // Item
        let cell2 = row.insertCell(1); // Hours
        let cell3 = row.insertCell(2); // Rate
        let cell4 = row.insertCell(3); // Earnings
        let cell5 = row.insertCell(4); // YTD

        let h = 0;
        let current = 0;
        let annual = 0;
        switch(key){
            case "Regular":
                h = regh;
                current = current_earnings_object[key];
                annual = annual_earnings_object[key];
                break;
            case "Commission":
                h = 0;
                current = current_earnings_object[key];
                annual = annual_earnings_object[key];
                break;
            case "Tips":
                h = 0;
                current = current_earnings_object[key];
                annual = annual_earnings_object[key];
                break;
            case "Vacation":
                h = vacah;
                current = current_earnings_object[key];
                annual = annual_earnings_object[key];
                break;
            case "Sick":
                h = sickh;
                current = current_earnings_object[key];
                annual = annual_earnings_object[key];
                break;
            case "Holiday":
                h = holh;
                current = current_earnings_object[key];
                annual = annual_earnings_object[key];
                break;
            case "Bonus":
                h = 0;
                current = current_earnings_object[key];
                annual = annual_earnings_object[key];
                break;
            case "Weekends":
                h = wkh;
                current = current_earnings_object[key];
                annual = annual_earnings_object[key];
                break;
            case "PerDiem":
                h = 0;
                current = current_earnings_object[key];
                annual = annual_earnings_object[key];
                break;
            case "Stipend":
                h = 0;
                current = current_earnings_object[key];
                annual = annual_earnings_object[key];
                break;
            case "Overtime":
                h = current_earnings_object[key]/current_earnings_object["Regular"]/1.5;
                current = current_earnings_object[key];
                annual = annual_earnings_object[key];
                break;
        }
        // h *= hours in pay period
        switch(payperiod){
            case 7:
                h *= 40;
                break;
            case 14:
                h *= 80;
                break;
            case 15:
                h *= 88.5;
                break;
            case 30:
                h *= 160;
                break;
        }            

        cell1.innerHTML = key;
        cell2.innerHTML = h.toFixed(2);
        if(h>0) cell3.innerHTML = (current/h).toFixed(2); else cell3.innerHTML = 0;
        if(h>0) cell4.innerHTML = (cell2.innerHTML*cell3.innerHTML).toFixed(2); else cell4.innerHTML = current_earnings_object[key].toFixed(2);
        cell5.innerHTML = (annual).toFixed(2);
    }
    // Add totals to earnings section
    let row = paystubEarnings.insertRow();
    row.insertCell(0).innerHTML = "Total";
    row.insertCell(1).innerHTML = "";
    row.insertCell(2).innerHTML = "";
    row.insertCell(3).innerHTML = 0;
    row.insertCell(4).innerHTML = 0;
    for(let i=0; i<paystubEarnings.rows.length-1; i++){
        if(i==0) continue;
        row.cells[3].innerHTML = (Number(row.cells[3].innerHTML) + Number(paystubEarnings.rows[i].cells[3].innerHTML)).toFixed(2);
        row.cells[4].innerHTML = (Number(row.cells[4].innerHTML) + Number(paystubEarnings.rows[i].cells[4].innerHTML)).toFixed(2);
    }
    
    let deductions = ["Federal Income Tax", "State Income Tax", "Local Income Tax", "Social Security Tax", "Medicare Tax", "401(k) Contribution", "Health Insurance"];

    // For each deduction, calculate an amount based on the current/annual earnings
    for(let ded of deductions){
        let rate = 0;
        switch(ded){
            case "Federal Income Tax":
                rate = .15;
                break;
            case "State Income Tax":
                rate = .05;
                break;
            case "Local Income Tax":
                rate = .01;
                break;
            case "Social Security Tax":
                rate = .062;
                break;
            case "Medicare Tax":
                rate = .0145;
                break;
            case "401(k) Contribution":
                rate = .05;
                break;
            case "Health Insurance":
                rate = .1;
                break;
        }
        createDeduction(ded, rate, current_earnings_object, annual_earnings_object); 
    }
    // Add totals to deductions section
    let row2 = paystubDeductions.insertRow(); // row to hold the total deductions 
    row2.insertCell(0).innerHTML = "Total";
    row2.insertCell(1).innerHTML = 0;
    row2.insertCell(2).innerHTML = 0;
    for(let i=0; i<paystubDeductions.rows.length-1; i++){
        if(i==0) continue;
        row2.cells[1].innerHTML = (Number(row2.cells[1].innerHTML) + Number(paystubDeductions.rows[i].cells[1].innerHTML)).toFixed(2);
        row2.cells[2].innerHTML = (Number(row2.cells[2].innerHTML) + Number(paystubDeductions.rows[i].cells[2].innerHTML)).toFixed(2);
    }

    // populate net pay section
    let row3 = paystubNetPay.insertRow();
    row3.insertCell(0).innerHTML = "Total:";
    // Current earnings - total deductions
    row3.insertCell(1).innerHTML = (paystubEarnings.rows[paystubEarnings.rows.length-1].cells[3].innerHTML - paystubDeductions.rows[paystubDeductions.rows.length-1].cells[1].innerHTML).toFixed(2);
    // Annual earnings - total deductions
    row3.insertCell(2).innerHTML = (paystubEarnings.rows[paystubEarnings.rows.length-1].cells[4].innerHTML - paystubDeductions.rows[paystubDeductions.rows.length-1].cells[2].innerHTML).toFixed(2);

    // Assign manual calc amount to manualIncome and ytd calc amount to ydtIncome
    var manualIncome = document.getElementById("manualIncome");
    var ytdIncome = document.getElementById("ytdIncome");

    var manualAmount =0;
    var ytdAmount = 0;
    let perYear = 14;
    let stubHours = 0;
    let acceptableEarnings = 0;
    let maxHours = 80;
    let payRate = 0;
    switch(payperiod){
        case 7:
            perYear = 52;
            maxHours = 40;
            break;
        case 14:
            perYear = 26;
            maxHours = 80;
            break;
        case 15:
            perYear = 24;
            maxHours = 88.5;
            break;
        case 30:
            perYear = 12;
            maxHours = 160;
            break;
    }


    for(let r of paystubEarnings.rows){
        if(r.rowIndex == 0) continue;
        if(r.cells[0].innerHTML == "Total") continue;
        if(r.cells[0].innerHTML == "Regular" || r.cells[0].innerHTML == "Holiday" || r.cells[0].innerHTML == "Vacation" || r.cells[0].innerHTML == "Sick") {
            payRate = Number(r.cells[2].innerHTML);
            stubHours += Number(r.cells[1].innerHTML);
            ytdAmount += Number(r.cells[4].innerHTML);

        }else if(r.cells[0].innerHTML != "Stipend"){
            acceptableEarnings += Number(r.cells[4].innerHTML);
            ytdAmount += Number(r.cells[4].innerHTML);

        }
    }
    stubHours = Math.min(stubHours, maxHours);
    manualAmount = (payRate*stubHours*perYear+acceptableEarnings).toFixed(2);
    ytdAmount = ytdCalc(ytdAmount, document.getElementById("payDatePaystub").innerHTML);
    manualIncome.setAttribute("answer", manualAmount);
    ytdIncome.setAttribute("answer", ytdAmount);
    manualIncome.value = "";
    ytdIncome.value = "";
    manualIncome.parentNode.style.backgroundColor = "";
    ytdIncome.parentNode.style.backgroundColor = "";

    // Populate metadata table
    var metadataTable = document.getElementById("metadataTable");
    while(metadataTable.rows.length > 1){
        metadataTable.deleteRow(1);
    }
    for(let key in metadata){
        let row = metadataTable.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = key;
        cell2.innerHTML = metadata[key];
        cell1.style = "font-weight: bold; text-align: right;";
        cell2.style= "text-align: left;";
    }

}

// Check if income calc == answer
function checkIncomeCalc(id){
    let input = document.getElementById(id);
    let cell = input.parentNode;
    let answer = JSON.parse(input.getAttribute('answer'));
    if(input.value == undefined || input.value == ""){
        cell.style.backgroundColor = "";
    }else if(answer == input.value){
        cell.style.backgroundColor = "rgb(200, 255, 200)";
    }else{
        cell.style.backgroundColor = "rgb(255, 200, 200)";
    }
}

// Calculate YTD income based on paystub data
function ytdCalc(amount, date){
    // Number of weeks into the year based on pay date
    var numWeeks = Math.ceil((new Date(date) - new Date("01/01/2023"))/(7*24*60*60*1000));

    return (amount*(52/numWeeks)).toFixed(2);

}
  
  //            !!!!Bonus points!!!!
  //
  // Make the below viewMetadata() a different function and have the previous function save the metadata to a cell so it can be called by the below. Have the metadataGenerator called by paystubGenerator and take the name to append to the author list
function viewMetadata(){
  // Get the modal
    var overlay = document.getElementById("overlay");
    overlay.style.display = "block";
}
function closeOverlay(){
    var overlay = document.getElementById("overlay");
    overlay.style.display = "";

}

function createDeduction(ded, rate, current_earnings_object, annual_earnings_object){
    let paystubDeductions = document.getElementById("paystubDeductions");
    let row = paystubDeductions.insertRow();
    let cell1 = row.insertCell(0); // Item
    let cell2 = row.insertCell(1); // Current
    let cell3 = row.insertCell(2); // YTD
    
    cell1.innerHTML = ded;
    cell2.innerHTML = Math.floor((current_earnings_object["Regular"]+current_earnings_object["Commission"]+current_earnings_object["Tips"]+current_earnings_object["Vacation"]+current_earnings_object["Sick"]+current_earnings_object["Holiday"]+current_earnings_object["Bonus"]+current_earnings_object["Weekends"]+current_earnings_object["PerDiem"]+current_earnings_object["Stipend"]+current_earnings_object["Overtime"])*rate*100)/100;
    cell3.innerHTML = Math.floor((annual_earnings_object["Regular"]+annual_earnings_object["Commission"]+annual_earnings_object["Tips"]+annual_earnings_object["Vacation"]+annual_earnings_object["Sick"]+annual_earnings_object["Holiday"]+annual_earnings_object["Bonus"]+annual_earnings_object["Weekends"]+annual_earnings_object["PerDiem"]+annual_earnings_object["Stipend"]+annual_earnings_object["Overtime"])*rate*100)/100;

}


function randomNameGenerator(min_length, max_length){
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower_cons = 'bcdfghjklmnpqrstvwxz';
    const lower_vow = 'aeiou';

    let co_name = '';
    var co_name_len = Math.floor(Math.random() * (max_length-min_length))+min_length;

    for(let i = 0; i < co_name_len; i++){
        if(i==0){
        co_name += uppercase.charAt(Math.floor(Math.random()*uppercase.length))
        }else if(i%2==0){
        co_name += lower_cons.charAt(Math.floor(Math.random()*lower_cons.length))
        }else{
        co_name += lower_vow.charAt(Math.floor(Math.random()*lower_vow.length))
        }
        
    }
    return co_name;
}

function metadataGenerator(){

    var formats = ['application/pdf','application/jpeg','application/png'];
    var authors = ['Adobe Acrobat', 'Helen Troy', 'Don Quixote', 'Ebenezer Scrooge','Microsoft Word', 'Microsoft Excel', 'Adobe Photoshop'];
    var filenames = Math.floor(Math.random())*9999999;
    var filesize = Math.floor(Math.random())*99;
    var producers = ['Adobe Acrobat', 'Epson Scan 1', 'iPhone Photoscan', 'Android Gallery', 'ChatGPT Image Creator',  'Adobe Photoshop'];
    var uuid = ['6372199','574833123','uuid:5843-5819-43812358-534825-54753'];
    var uuid2 = ['8473857', '64892939', 'uuid:473438-857838-123874352-834732'];

    var risky = Math.random();
    var d = new Date();
    var yyyy = d.getFullYear();
    var mm = d.getMonth()+1;
    var dd = d.getDate();

    var format = formats[Math.floor(Math.random()*risky*formats.length)];
    var author =  authors[Math.floor(Math.random()*risky*authors.length)];
    var filename = 'supporting_doc_attachment-' + filenames;
    var filesize = filesize + ' KiB';
    var filetype = format.substring(12, format.length).toUpperCase();
    var mimetype = format;
    var producer = producers[Math.floor(Math.random()*risky*producers.length)];
    var directory = '/tmp/d'+ yyyy + mm + dd + '-1-6-jgndixm';
    var pagecount= 1;
    var createdate= new Date(d - Math.random()*60000*60*24*14);
    var documentid = uuid[Math.floor(risky*uuid.length)];
    var instanceid = uuid2[Math.floor(risky*uuid2.length)];
    var linearized = 'No';
    if(risky < 0.8) var modifydate = createdate; else var modifydate = new Date(d - Math.random()*60000*60*24*14);
    var pdfversion = '1.4';
    var sourcefile = directory + filename;
    var fileaccessdate = new Date(d - Math.random()*60000*60*24*14);
    var filemodifydate = fileaccessdate;
    var exiftoolversion = '12.16';
    var filepermissions = 'rw-r--r--';
    var filetypeextension = filetype.toLowerCase();
    var fileinodechangedate = fileaccessdate;

    var metadata = {
        'format': format,
        'author': author,
        'filename': filename,
        'filesize': filesize,
        'filetype': filetype,
        'mimetype': mimetype,
        'producer': producer,
        'directory': directory,
        'pagecount': pagecount,
        'createdate': createdate,
        'documentid': documentid,
        'instanceid': instanceid,
        'linearized': linearized,
        'modifydate': modifydate,
        'pdfversion': pdfversion,
        'sourcefile': sourcefile,
        'fileaccessdate': fileaccessdate,
        'filemodifydate': filemodifydate,
        'exiftoolversion': exiftoolversion,
        'filepermissions': filepermissions,
        'filetypeextension': filetypeextension,
        'fileinodechangedate': fileinodechangedate
    }

    return metadata;
  
}