window.onload = function() {
    document.getElementById('to-login').addEventListener('click', loadLogin);
    document.getElementById('to-register').addEventListener('click', loadRegister);
    document.getElementById('to-dashboard').addEventListener('click', loadDashboard);
    document.getElementById('to-logout').addEventListener('click', logout);
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
    APP_VIEW.innerHTML = await fetchView('createReimb.view');
    createReimb();
}

async function createReimb() {
    console.log('in createReimb()');
    let newReimb = [
        document.getElementById('reimb-ampunt').value,
        localStorage.getItem('userInfo').value,
        document.getElementById('reimb-description').value,
        document.getElementById('reimb-type').value
    ];
    let response = await fetch('request', {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('jwt'),

        },
    });
    let responseBody2 = await response.json();
    console.log(responseBody2);
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
            'Info': localStorage.getItem('userInfo')
        },
    });
    let responseBody = await response.json();
    console.log(responseBody);
    makeReimbTable(responseBody); 
}

function makeReimbTable(responseBody){   
    let reimbContainer = document.getElementById('reimbViewTable');

    if(responseBody.length>0) {

        let output = `<h1>Showing reimbursements for the user: <br/><br/></h1>
                            <table class="table table-striped table-hover">
                                <tr class="success"> 
                                    <th class="text-center">Reimbursement Amount</th>
                                    <th class="text-center">Date/Time Submitted</th>
                                    <th class="text-center">Date/Time Resolved</th>
                                    <th class="text-center">Reimbursement Description</th>
                                    <th class="text-center">Reimbursement Status</th>
                                    <th class="text-center">Reimbursement Type</th>
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
                            <td>${res.status.status}</td>
                            <td>${res.type.type}</td>
                        </tr>`
        });
        output += `</table>`;
        reimbContainer.innerHTML = output;

        // let reimbTable =  document.getElementById('tHead');
        // let headRow = document.createElement('tr');
        // headRow.setAttribute('id', 'headRow');

        // let amount = document.createElement('th');
        // amount.setAttribute('id', 'amount');
        // document.getElementById('amount').innerText = 'Reimbursement Amount';
        // document.getElementById('headROw').appendChild(amount);

        // let submitted = document.createElement('th');
        // submitted.setAttribute('id', 'submitted');
        // document.getElementById('submitted').innerText = 'Time Submitted';
        // document.getElementById('headROw').appendChild(submitted);

        // let resolved = document.createElement('th');
        // resolved.setAttribute('id', 'resolved');
        // document.getElementById('resolved').innerText = 'Time Resolved';
        // document.getElementById('headROw').appendChild(resolved);

        // let description = document.createElement('th');
        // description.setAttribute('id', 'description');
        // document.getElementById('description').innerText = 'Reimbursement Description';
        // document.getElementById('headROw').appendChild(description);

        // let status = document.createElement('th');
        // status.setAttribute('id', 'status');
        // document.getElementById('status').innerText = 'Reimbursement Status';
        // document.getElementById('headROw').appendChild(status);

        // let type = document.createElement('th');
        // type.setAttribute('id', 'type');
        // document.getElementById('type').innerText = 'Reimbursement Type';
        // document.getElementById('headROw').appendChild(type);
        // reimbTable.appendChild(headRow);
        
        // for(let i=0; i < responseBody.length; i++) {
        //     let newRow = document.createElement('tr');

        //     let newAmount = document.createElement('td');
        //     newAmount.innerHTML = responseBody[i].reimbAmount;
        //     console.log(responseBody[i].reimbAmount);
        //     newRow.appendChild(newAmount);

        //     let newSubmitted = document.createElement('td');
        //     newAmount.innerHTML = responseBody[i].submitted;
        //     newRow.appendChild(newSubmitted);

        //     let newResolved = document.createElement('td');
        //     newAmount.innerHTML = responseBody[i].resolved;
        //     newRow.appendChild(newResolved);

        //     let newDescription = document.createElement('td');
        //     newAmount.innerHTML = responseBody[i].description;
        //     newRow.appendChild(newDescription);

        //     let newStatus = document.createElement('td');
        //     newAmount.innerHTML = responseBody[i].status;
        //     newRow.appendChild(newStatus);

        //     let newType = document.createElement('td');
        //     newAmount.innerHTML = responseBody[i].type;
        //     newRow.appendChild(newType);
            
        //     reimbTable.appendChild(newRow);
        // }
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
        localStorage.setItem('userInfo', response.headers.get('Info'));
        // document.getElementById('name').innerHTML = localStorage.getItem('userInfo');
        console.log(localStorage.getItem('userInfo'));
        
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

//-------------------------------------------------------------------------------------
async function fetchView(uri) {
    let response = await fetch(uri, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Authorization': localStorage.getItem('jwt'),
            'Info':localStorage.getItem('userInfo')
        }
    });

    if(response.status == 401) loadLogin();
    return await response.text();
}

//-------------------------------------------------------------------------------------

const APP_VIEW = document.getElementById('app-view');
const DYNAMIC_CSS_LINK = document.getElementById('dynamic-css');