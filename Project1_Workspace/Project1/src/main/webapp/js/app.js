window.onload = function() {
    loadLogin();
    document.getElementById('to-login').addEventListener('click', loadLogin);
    document.getElementById('to-register').addEventListener('click', loadRegister);
    
    if (localStorage.getItem('userRole') == 'MANAGER')
        document.getElementById('to-dashboard').addEventListener('click', loadManDashboard);
    else if(localStorage.getItem('userRole') == 'EMPLOYEE') 
        document.getElementById('to-dashboard').addEventListener('click', loadDashboard);
    else
        loadLogin();
    document.getElementById('to-logout').addEventListener('click', logout);
}

function logout() {
    localStorage.clear();
    loadLogin();
}

/*
    Login component

        - loadLogin()
        - configureLogin()
        - login()
*/

// Block of functions to load & create a form for submitting new reimbursements
async function loadCreateReimb() {
    console.log('in loadCreateReimb()');
    APP_VIEW.innerHTML = await fetchView('submitReimb.view');
    configureCreateReimb();
}

function configureCreateReimb() {
    console.log('configureCreateReimb()');
    document.getElementById('to-submitReimb').addEventListener('click', createReimb);
}

async function createReimb() {
    console.log('in createReimb()');
    let newReimb = [
        document.getElementById('reimb-amount').value,
        localStorage.getItem('userId'),
        document.getElementById('reimb-description').value,
        document.getElementById('reimb-type').value ];

    console.log(newReimb);

    let response = await fetch('request', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('jwt'),
        },
        body: JSON.stringify(newReimb)
    });
    let responseBody2 = await response.json();
    console.log(responseBody2);
    document.getElementById('reimbInfo').setAttribute('hidden', 'false');
    // makeReimbForm(responseBody2); 
}

// function makeReimbForm(responseBody2) {
//     let reimbCreateContainer = document.getElementById('submitReimbContainer');

//     let output = ``
// }

// Block of functions to load & create existing reimbursements table
async function loadViewReimb() {
    console.log('in loadViewReimb()');
    APP_VIEW.innerHTML = await fetchView('viewReimb.view');
    getReimbs();
}

async function getReimbs() {
    console.log('in getReimbs()');
    let response = await fetch('request', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('jwt'),
            'Info': localStorage.getItem('userId'),
           
        },
    });
    let responseBody = await response.json();
    console.log(responseBody);
    if (localStorage.getItem('userRole') == 'EMPLOYEE')
        makeReimbTable(responseBody);
    else if (localStorage.getItem('userRole') == 'MANAGER')
        createManReimb(responseBody);
}
async function getAllReimbs() {
    console.log('in getReimbs()');
    let response = await fetch('request', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('jwt'),
            'Info': localStorage.getItem('userId'),
           
        },
    });
    let responseBody = await response.json();
    console.log(responseBody);
    createViewAllReimb(responseBody);
}

function makeReimbTable(responseBody){   
    let reimbContainer = document.getElementById('reimbViewTable');

    if(responseBody.length>0) {

        let output = `<h1>Showing reimbursements for the user: ${localStorage.getItem('userFirst')} <br/><br/></h1>
                            <table class="table table-striped table-hover">
                                <tr class="success"> 
                                    <th class="text-center">Reimbursement Amount</th>
                                    <th class="text-center">Date/Time Submitted</th>
                                    <th class="text-center">Date/Time Resolved</th>
                                    <th class="text-center">Reimbursement Description</th>
                                    <th class="text-center">Reimbursement Type</th>
                                    <th class="text-center">Reimbursement Status</th>
                                </tr>`;

            responseBody.forEach(function(res) {
                //let time = new Date().getTime();
                let dateSub = new Date(res.submitted);
                let dateSubStr = dateSub.toString();
                let dateRes = new Date(res.resolved);
                let dateResStr = dateRes.toString();

            output += `<tr class="text-center">
                            <td>${res.reimbAmount}</td>
                            <td>${dateSubStr.substring(4, 21)}</td>
                            <td>${dateResStr.substring(4, 21)}</td>
                            <td>${res.description}</td> 
                            <td>${res.type.type}</td>
                            <td>${res.status.status}</td>
                        </tr>`
        });
        output += `</table>`;
        reimbContainer.innerHTML = output;
    }
}

async function loadLogin() {
    console.log('in loadLogin()');

    // fetchView('login.view').then(view => {
    //     APP_VIEW.innerHTML = view;
    //     DYNAMIC_CSS_LINK.href = 'css/login.css';
    //     configureLogin();
    // });
    
    APP_VIEW.innerHTML = await fetchView('login.view');
    DYNAMIC_CSS_LINK.href = 'css/login.css';
    configureLogin();
}

function configureLogin() {
    console.log('in configureLogin()');
    document.getElementById('alert-msg').hidden = true;
    document.getElementById('submit-creds').addEventListener('click', login);
   
}

async function login() {
    console.log('in login()');
    let credentials = [];
    credentials.push(document.getElementById('username-cred').value);
    credentials.push(document.getElementById('password-cred').value);

    let response = await fetch('auth', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    if(response.status == 200) {
        document.getElementById('alert-msg').hidden = true;
        console.log(response.headers.get('Authorization'));
        localStorage.setItem('jwt', response.headers.get('Authorization'));
        localStorage.setItem('userId', response.headers.get('Info'));
        localStorage.setItem('userFirst', response.headers.get('UserFirstName'));
        localStorage.setItem('userLast', response.headers.get('UserLastName'));
        localStorage.setItem('userName', response.headers.get('UserName'));
        localStorage.setItem('userRole', response.headers.get('UserRole'));
        // document.getElementById('name').innerHTML = localStorage.getItem('userId');
        console.log(localStorage.getItem('userId'));
        
        if (localStorage.getItem('userRole') == 'EMPLOYEE')
            loadDashboard();
        else if (localStorage.getItem('userRole') == 'MANAGER')
            loadManDashboard();
        
    } else {
        document.getElementById('alert-msg').hidden = false;
    }
}



//-------------------------------------------------------------------------------------

/*
    Register component

        - loadRegister()
        - configureRegister()
        - validateUsername()
        - validatePassword()
        - register()
*/

async function loadRegister() {
    console.log('in loadRegister()');
    APP_VIEW.innerHTML = await fetchView('register.view');
    DYNAMIC_CSS_LINK.href = 'css/register.css';
    configureRegister();
}

function configureRegister() {
    console.log('in configureRegister()');
    document.getElementById('register-username').addEventListener('blur', validateUsername);
    document.getElementById('register-password').addEventListener('keyup', validatePassword);
    document.getElementById('register-account').addEventListener('click', register);
}

function validateUsername(event) {
    console.log('in validateUsername');
    console.log(event.target.value);
}

function validatePassword(event) {
    console.log('in validatePassword');
    console.log(event.target.value);
}

async function register() {
    console.log('in register()');

    let newUser = [ document.getElementById('register-username').value,
                    document.getElementById('register-password').value,
                    document.getElementById('register-fn').value,
                    document.getElementById('register-ln').value ];
                  
    console.log('newUser');

    let response = await fetch('register', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    });
    console.log(response);

    let responseBody = await response.json();
    console.log(responseBody);
}



//-------------------------------------------------------------------------------------

/*
    Dashboard component
        - loadDashboard()
 */

async function loadDashboard() {
    console.log('in loadDashboard()');
    APP_VIEW.innerHTML = await fetchView('dashboard.view');
    DYNAMIC_CSS_LINK.href = 'css/dashboard.css';
    document.getElementById('to-reimbs').addEventListener('click', loadViewReimb);
    document.getElementById('to-createReimb').addEventListener('click', loadCreateReimb);
    configureDashboard();
}

function configureDashboard() {
    console.log('in configureDashboard()');
}

async function loadManDashboard() {
    console.log('in loadManDashboard()');
    APP_VIEW.innerHTML = await fetchView('managerDashboard.view');
    DYNAMIC_CSS_LINK.href = 'css/dashboard.css';
    document.getElementById('to-reimbsMan').addEventListener('click', loadViewManReimb);
    document.getElementById('to-reimbsEmpMan').addEventListener('click', loadViewAllReimb);
    document.getElementById('to-createReimb').addEventListener('click', loadCreateReimb);
    
}

async function loadViewManReimb(){
    console.log('in loadManReimb()');
    APP_VIEW.innerHTML = await fetchView('ViewManReimb.view');
    DYNAMIC_CSS_LINK.href = 'css/register.css';
    getReimbs();
}

async function loadViewAllReimb(){
    console.log('in loadViewAllReimb()');
    APP_VIEW.innerHTML = await fetchView('ViewAllReimb.view');
    DYNAMIC_CSS_LINK.href = 'css/register.css';
    getAllReimbs();
    document.getElementById('filter-button').addEventListener('click', filterReimbs);
}

async function filterReimbs() {
    let response = await fetch('request', {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('jwt'),
            'Info': localStorage.getItem('userId'),
        },
    });
    let responseBody = await response.json();
    console.log(responseBody);
    ViewFilteredReimbs(responseBody);
}

function ViewFilteredReimbs(responseBody) {
    let reimbContainer = document.getElementById('reimbViewTableMan');

    if(responseBody.length>0) {

        let output = `<h1>Showing reimbursements of all employees <br/><br/></h1>
                            <table id = myReimbTable class="table table-striped table-hover">
                                <tr class="success"> 
                                    <th class="text-center">Reimbursement Amount</th>
                                    <th class="text-center">Date/Time Submitted</th>
                                    <th class="text-center">Date/Time Resolved</th>
                                    <th class="text-center">Reimbursement Description</th>
                                    <th class="text-center">Reimbursement Type</th>
                                    <th class="text-center">Reimbursement Status</th>
                                </tr>`;
            let i = 0;
            responseBody.forEach(function(res) {
                console.log(document.getElementById('filterValue').value);
                if(res.status.status == document.getElementById('filterValue').value) {

                    if(res.userId != localStorage.getItem('userId')) {
                        //let time = new Date().getTime();
                        let dateSub = new Date(res.submitted);
                        let dateSubStr = dateSub.toString();
                        let dateRes = new Date(res.resolved);
                        let dateResStr = dateRes.toString();

                    output += `<tr id="${i}" class="text-center">
                                    <td id="${i}amount">${res.reimbAmount}</td>
                                    <td id="${i}submitted">${dateSubStr.substring(4, 21)}</td>
                                    <td id="${i}resolved">${dateResStr.substring(4, 21)}</td>
                                    <td id="${i}description">${res.description}</td> 
                                    <td id="${i}type">${res.type.type}</td>
                                    <td id="${i}status">
                                        <select id="selectStatus" type="text">
                                            <option value = ${res.status.status} selected> ${res.status.status}<option>
                                            <option value = "Approved">Approve</option>
                                            <option value = "Denied">Deny</option>
                                        </select>
                                    </td>
                                </tr>`
                                i++;
                }
                
            }
        });
        output += `</table>`;
        reimbContainer.innerHTML = output;
    }
    document.getElementById('update-reimbs').addEventListener('click', updateReimbs);
}

async function updateReimbs() {
    console.log('in createReimb()');
    let length = document.getElementById('myReimbTable').childNodes.length
    for(i = 0; i<length; i++)
    {
    let currentRow = document.getElementById(`${i}`)
    console.log(currentRow);
    let newReimb = [
        document.getElementById(`${i}amount`).innerHTML,
        document.getElementById(`${i}submitted`).innerHTML,
        localStorage.getItem('userId'),
        document.getElementById(`${i}description`).innerHTML,
        document.getElementById(`${i}status`).value,
        document.getElementById(`${i}type`).innerHTML,
        
     ];

    console.log(newReimb);

     await fetch('request', {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('jwt'),
        },
        body: JSON.stringify(newReimb)
    });
    }
    //document.getElementById('reimbInfo').setAttribute('hidden', 'false');
    // makeReimbForm(responseBody2); 
}

function createManReimb(responseBody) {
    let reimbContainer = document.getElementById('ManReimbTable');

    if(responseBody.length>0) {

        let output = `<h1>Showing reimbursements for the user: ${localStorage.getItem('userFirst')} [Manager] <br/><br/></h1>
                            <table class="table table-striped table-hover">
                                <tr class="success"> 
                                    <th class="text-center">Reimbursement Amount</th>
                                    <th class="text-center">Date/Time Submitted</th>
                                    <th class="text-center">Date/Time Resolved</th>
                                    <th class="text-center">Reimbursement Description</th>
                                    <th class="text-center">Reimbursement Type</th>
                                    <th class="text-center">Reimbursement Status</th>
                                </tr>`;

            responseBody.forEach(function(res) {
                if(res.userId == localStorage.getItem('userId')) {
                    //let time = new Date().getTime();
                    let dateSub = new Date(res.submitted);
                    let dateSubStr = dateSub.toString();
                    let dateRes = new Date(res.resolved);
                    let dateResStr = dateRes.toString();

                output += `<tr class="text-center">
                                <td>${res.reimbAmount}</td>
                                <td>${dateSubStr.substring(4, 21)}</td>
                                <td>${dateResStr.substring(4, 21)}</td>
                                <td>${res.description}</td> 
                                <td>${res.type.type}</td>
                                <td>${res.status.status}</td>
                            </tr>`
             }
        });
        output += `</table>`;
        reimbContainer.innerHTML = output;
    }
}

function createViewAllReimb(responseBody) {
    let reimbContainer = document.getElementById('reimbViewTableMan');

    if(responseBody.length>0) {

        let output = `<h1>Showing reimbursements of all employees <br/><br/></h1>
                            <table class="table table-striped table-hover">
                                <tr class="success"> 
                                    <th class="text-center">Reimbursement Amount</th>
                                    <th class="text-center">Date/Time Submitted</th>
                                    <th class="text-center">Date/Time Resolved</th>
                                    <th class="text-center">Reimbursement Description</th>
                                    <th class="text-center">Reimbursement Type</th>
                                    <th class="text-center">Reimbursement Status</th>
                                </tr>`;

            responseBody.forEach(function(res) {
                if(res.userId != localStorage.getItem('userId')) {
                    //let time = new Date().getTime();
                    let dateSub = new Date(res.submitted);
                    let dateSubStr = dateSub.toString();
                    let dateRes = new Date(res.resolved);
                    let dateResStr = dateRes.toString();

                output += `<tr class="text-center">
                                <td>${res.reimbAmount}</td>
                                <td>${dateSubStr.substring(4, 21)}</td>
                                <td>${dateResStr.substring(4, 21)}</td>
                                <td>${res.description}</td> 
                                <td>${res.type.type}</td>
                                <td>${res.status.status}</td>
                            </tr>`
             }
        });
        output += `</table>`;
        reimbContainer.innerHTML = output;
    }
}

function configureDashboard() {
    console.log('in configureDashboard()');
}

//-------------------------------------------------------------------------------------
async function fetchView(uri) {
    let response = await fetch(uri, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Authorization': localStorage.getItem('jwt'),
            'Info':localStorage.getItem('userId')
        }
    });

    if(response.status == 401) loadLogin();
    return await response.text();
}

//-------------------------------------------------------------------------------------

const APP_VIEW = document.getElementById('app-view');
const DYNAMIC_CSS_LINK = document.getElementById('dynamic-css');