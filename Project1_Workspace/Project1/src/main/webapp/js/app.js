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
            'Authorization': localStorage.getItem('jwt')
        },
    });
    let responseBody = await response.json();
    console.log(responseBody);
    makeTable(responseBody) 
}

function makeTable(responseBody){   
    if(responseBody.length>0) {

    let reimbTable =  document.getElementById('tHead');
    let headRow = document.createElement('tr');

    let amount = document .createElement('th');
    amount.innerHTML = 'Reimbursement Amount';
    headRow.appendChild(amount);

    let submitted = document .createElement('th');
    submitted.innerHTML = 'Time Submitted';
    headRow.appendChild(submitted);

    let resolved = document .createElement('th');
    resolved.innerHTML = 'Time Resolved';
    headRow.appendChild(resolved);

    let description = document .createElement('th');
    description.innerHTML = 'Reimbursement Description';
    headRow.appendChild(description);

    let status = document .createElement('th');
    status.innerHTML = 'Reimbursement Status';
    headRow.appendChild(status);

    let type = document .createElement('th');
    type.innerHTML = 'Reimbursement Type';
    headRow.appendChild(type);
    reimbTable.appendChild(headRow);
    
    for(let i=0; i < responseBody.length; i++) {
        let newRow = document.createElement('tr');

        let newAmount = document .createElement('td');
        newAmount.innerHTML = responseBody[i].reimbAmount;
        console.log(responseBody[i].reimbAmount);
        newRow.appendChild(newAmount);

        let newSubmitted = document .createElement('td');
        newAmount.innerHTML = responseBody[i].submitted;
        newRow.appendChild(newSubmitted);

        let newResolved = document .createElement('td');
        newAmount.innerHTML = responseBody[i].resolved;
        newRow.appendChild(newResolved);

        let newDescription = document .createElement('td');
        newAmount.innerHTML = responseBody[i].description;
        newRow.appendChild(newDescription);

        let newStatus = document .createElement('td');
        newAmount.innerHTML = responseBody[i].status;
        newRow.appendChild(newStatus);

        let newType = document .createElement('td');
        newAmount.innerHTML = responseBody[i].type;
        newRow.appendChild(newType);
        
        reimbTable.appendChild(newRow);
    }
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