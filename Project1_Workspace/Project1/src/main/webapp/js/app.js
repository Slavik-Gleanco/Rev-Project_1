window.onload = function() {
    loadLogin();
    document.getElementById('to-register').addEventListener('click', loadRegister);
    document.getElementById('to-dashboard').addEventListener('click', loadDashboard);
    document.getElementById('toHome').addEventListener('click', loadDashboard);
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
    DYNAMIC_CSS_LINK.href = 'css/submitReimb.css';
    configureCreateReimb();
}

function configureCreateReimb() {
    console.log('configureCreateReimb()');
    document.getElementById('emptyReimb-msg').hidden = true;
    document.getElementById('reimbInfo').hidden = true;
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
    if(response.status == 200) {
        document.getElementById('emptyReimb-msg').hidden = true;
        document.getElementById('reimbInfo').hidden = false;
    }
    else if( response.status == 400) {
        document.getElementById('emptyReimb-msg').hidden = false;
        document.getElementById('reimbInfo').hidden = true;
    }
}

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
                                    <th class="text-center">Reimbursement Amount ($)</th>
                                    <th class="text-center">Date/Time Submitted</th>
                                    <th class="text-center">Date/Time Resolved</th>
                                    <th class="text-center">Reimbursement Description</th>
                                    <th class="text-center">Reimbursement Type</th>
                                    <th class="text-center">Reimbursement Status</th>
                                </tr>`;

            responseBody.forEach(function(res) {
                if(res.resolved == null)
                    {
                        let dateResStr = "-";
                        let dateSub = new Date(res.submitted);
                        let dateSubStr = dateSub.toString();
                        output += `<tr class="text-center">
                                    <td>${res.reimbAmount}</td>
                                    <td>${dateSubStr.substring(4, 21)}</td>
                                    <td>${dateResStr}</td>
                                    <td>${res.description}</td> 
                                    <td>${res.type.type}</td>
                                    <td>${res.status.status}</td>
                                </tr>`
                    }
                    else{let dateSub = new Date(res.submitted);
                        let dateSubStr = dateSub.toString();
                        let dateRes = new Date(res.resolved);
                        let dateResStr = dateRes.toString().substring(4, 21);
    
                        output += `<tr class="text-center">
                                    <td>${res.reimbAmount}</td>
                                    <td>${dateSubStr.substring(4, 21)}</td>
                                    <td>${dateResStr}</td>
                                    <td>${res.description}</td> 
                                    <td>${res.type.type}</td>
                                    <td>${res.status.status}</td>
                                </tr>`
                    }
        });
        output += `</table>`;
        reimbContainer.innerHTML = output;
    }
    else
        document.getElementById('noReimbs').hidden = false;
}

async function loadLogin() {
    console.log('in loadLogin()');
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
        console.log(localStorage.getItem('userId'));
        loadDashboard();
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
    localStorage.clear();
    console.log('in loadRegister()');
    APP_VIEW.innerHTML = await fetchView('register.view');
    DYNAMIC_CSS_LINK.href = 'css/register.css';
    configureRegister();
}

function configureRegister() {
    console.log('in configureRegister()');
    document.getElementById('emptyReg-msg').hidden = true;
    document.getElementById('usertkn-msg').hidden = true;
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
    if(response.status == 200) {
        document.getElementById('emptyReg-msg').hidden = true;
        document.getElementById('usertkn-msg').hidden = true;
        loadLogin();
    }
    else if( response.status == 400) {
        document.getElementById('usertkn-msg').hidden = true;
        document.getElementById('emptyReg-msg').hidden = false;
    }
    else if( response.status == 409) {
        document.getElementById('emptyReg-msg').hidden = true;
        document.getElementById('usertkn-msg').hidden = false;
    }
}
//-------------------------------------------------------------------------------------

/*
    Dashboard component
        - loadDashboard()
 */

async function loadDashboard() {
    if(localStorage.getItem('userRole') == 'EMPLOYEE')
    {
    console.log('in loadDashboard()');
    APP_VIEW.innerHTML = await fetchView('dashboard.view');
    DYNAMIC_CSS_LINK.href = 'css/dashboard.css';
    document.getElementById('to-reimbs').addEventListener('click', loadViewReimb);
    document.getElementById('to-createReimb').addEventListener('click', loadCreateReimb);
    configureDashboard();
    }
    else if(localStorage.getItem('userRole') == 'MANAGER')
    {
        loadManDashboard();
    }
    
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
    DYNAMIC_CSS_LINK.href = 'css/viewAllReimb.css';
    getAllReimbs();
    document.getElementById('filter-button').addEventListener('click', filterReimbs);
    document.getElementById('reimbUpdateInfo').hidden = true;
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
    document.getElementById('reimbUpdateInfo').hidden = true;
    let reimbContainer = document.getElementById('reimbViewTableMan');

    if(responseBody.length>0) {

        let output = `<h1>Showing reimbursements of all employees <br/><br/></h1>
                            <table  class="table table-striped table-hover">
                            <tbody id="myReimbTable">
                                <tr class="success"> 
                                    <th class="text-center">Reimbursement Amount ($)</th>
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
                        if(res.resolved == null)
                        {   
                            let dateResStr = "-";
                            let dateSub = new Date(res.submitted);
                            let dateSubStr = dateSub.toString();
                             output += `<tr id="${i}" class="text-center">
                                <td id="${i}reimbId" hidden="true">${res.reimbId}</td>
                                <td id="${i}amount">${res.reimbAmount}</td>
                                <td>${dateSubStr.substring(4, 21)}</td>
                                <td id="${i}resolved">${dateResStr}</td>
                                <td id="${i}description">${res.description}</td> 
                                <td id="${i}type">${res.type.type}</td>
                                <td id="${i}status">
                                    <select id="${i}selectStatus" type="text">
                                        <option value = "${res.status.status}">${res.status.status}</option>
                                        <option value = "Approved">Approve</option>
                                        <option value = "Denied">Deny</option>
                                    </select>
                                </td>
                                <td id="${i}submitted" hidden="true">${dateSub.getTime()}</td>
                            </tr>`
                            
                        }
                    else {
                        let dateSub = new Date(res.submitted);
                        let dateSubStr = dateSub.toString();
                        let dateRes = new Date(res.resolved);
                        let dateResStr = dateRes.toString().substring(4, 21);
                            output += `<tr id="${i}" class="text-center">
                                            <td id="${i}reimbId" hidden="true">${res.reimbId}</td>
                                            <td id="${i}amount">${res.reimbAmount}</td>
                                            <td>${dateSubStr.substring(4, 21)}</td>
                                            <td id="${i}resolved">${dateResStr}</td>
                                            <td id="${i}description">${res.description}</td> 
                                            <td id="${i}type">${res.type.type}</td>
                                            <td id="${i}status">
                                                <select id="${i}selectStatus" type="text">
                                                    <option value = "${res.status.status}">${res.status.status}</option>
                                                    <option value = "Approved">Approve</option>
                                                    <option value = "Denied">Deny</option>
                                                </select>
                                            </td>
                                            <td id="${i}submitted" hidden="true">${dateSub.getTime()}</td>
                                        </tr>`
                        }       
                        i++;
                }   
            }
        });
        output += `</tbody>
                    </table>`;
        reimbContainer.innerHTML = output;
    }
    document.getElementById('update-reimbs').addEventListener('click', updateReimbs);
}

async function updateReimbs() {
    console.log('in createReimb()');
    let length = document.getElementById('myReimbTable').childNodes.length
    console.log(length);
    console.log('Our table: ' + document.getElementById('myReimbTable'));
    for(i = 1; i<length-1; i++) {
        if(document.getElementById(`${i-1}selectStatus`).value != 'Pending'){
            let currentRow = document.getElementById(`${i}`)
            console.log(currentRow);
            let newReimb = [
                document.getElementById(`${i-1}reimbId`).innerHTML,
                document.getElementById(`${i-1}amount`).innerHTML,
                document.getElementById(`${i-1}submitted`).innerHTML,
                localStorage.getItem('userId'),
                document.getElementById(`${i-1}description`).innerHTML,
                document.getElementById(`${i-1}selectStatus`).value,
                document.getElementById(`${i-1}type`).innerHTML
            ];

        console.log(newReimb);

        let response = await fetch('request', {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('jwt'),
            },
            body: JSON.stringify(newReimb)
        });
        let responseBody = await response.json();
        console.log(responseBody);
        document.getElementById('reimbUpdateInfo').hidden = false;
        }   
    }
}

function createManReimb(responseBody) {
    let reimbContainer = document.getElementById('ManReimbTable');

    if(responseBody.length>0) {

        let output = `<h1>Showing reimbursements for the user: ${localStorage.getItem('userFirst')} [Manager] <br/><br/></h1>
                            <table class="table table-striped table-hover">
                                <tr class="success"> 
                                    <th class="text-center">Reimbursement Amount ($)</th>
                                    <th class="text-center">Date/Time Submitted</th>
                                    <th class="text-center">Date/Time Resolved</th>
                                    <th class="text-center">Reimbursement Description</th>
                                    <th class="text-center">Reimbursement Type</th>
                                    <th class="text-center">Reimbursement Status</th>
                                </tr>`;

            responseBody.forEach(function(res) {
                if(res.userId == localStorage.getItem('userId')) {
                    if(res.resolved == null)
                    {
                        let dateResStr = "-";
                        let dateSub = new Date(res.submitted);
                        let dateSubStr = dateSub.toString();
                        output += `<tr class="text-center">
                                    <td>${res.reimbAmount}</td>
                                    <td>${dateSubStr.substring(4, 21)}</td>
                                    <td>${dateResStr}</td>
                                    <td>${res.description}</td> 
                                    <td>${res.type.type}</td>
                                    <td>${res.status.status}</td>
                                </tr>`
                    }
                    else{let dateSub = new Date(res.submitted);
                        let dateSubStr = dateSub.toString();
                        let dateRes = new Date(res.resolved);
                        let dateResStr = dateRes.toString().substring(4, 21);
    
                        output += `<tr class="text-center">
                                    <td>${res.reimbAmount}</td>
                                    <td>${dateSubStr.substring(4, 21)}</td>
                                    <td>${dateResStr}</td>
                                    <td>${res.description}</td> 
                                    <td>${res.type.type}</td>
                                    <td>${res.status.status}</td>
                                </tr>`
                    }
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
                                    <th class="text-center">Reimbursement Amount ($)</th>
                                    <th class="text-center">Date/Time Submitted</th>
                                    <th class="text-center">Date/Time Resolved</th>
                                    <th class="text-center">Reimbursement Description</th>
                                    <th class="text-center">Reimbursement Type</th>
                                    <th class="text-center">Reimbursement Status</th>
                                </tr>`;

            responseBody.forEach(function(res) {
                if(res.userId != localStorage.getItem('userId')) {
                    console.log(res.resolved);
                if(res.resolved == null)
                {
                    let dateResStr = "-";
                    let dateSub = new Date(res.submitted);
                    let dateSubStr = dateSub.toString();
                    output += `<tr class="text-center">
                                <td>${res.reimbAmount}</td>
                                <td>${dateSubStr.substring(4, 21)}</td>
                                <td>${dateResStr}</td>
                                <td>${res.description}</td> 
                                <td>${res.type.type}</td>
                                <td>${res.status.status}</td>
                            </tr>`
                }
                else{let dateSub = new Date(res.submitted);
                    let dateSubStr = dateSub.toString();
                    let dateRes = new Date(res.resolved);
                    let dateResStr = dateRes.toString().substring(4, 21);

                    output += `<tr class="text-center">
                                <td>${res.reimbAmount}</td>
                                <td>${dateSubStr.substring(4, 21)}</td>
                                <td>${dateResStr}</td>
                                <td>${res.description}</td> 
                                <td>${res.type.type}</td>
                                <td>${res.status.status}</td>
                            </tr>`
                }              
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