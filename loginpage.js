let uricreateuser = "http://localhost:80/api/v1/users";
let uriloginstr = "http://localhost:80/api/v1/login";



const sendHttpRequest = (method, url, data) => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.responseType = 'json';

        if (data) {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }

        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response);
            } else {
                resolve(xhr.response);
            }
        };

        xhr.onerror = () => {
            reject('Something went wrong!');
        };

        xhr.send(JSON.stringify(data));
    });
    return promise;
};


async function postUser() {
    // event.prevent
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
let initialbudget = document.getElementById('initalbudget').value;
    console.log(username, password , initialbudget)
if (username == '' || password == '' || initialbudget == '') {
    alert("please enter correct values!");
    return;
}

await sendHttpRequest('POST', uricreateuser, {
    username: username,
    password: password,
    amount : initialbudget
}).then(responseData => { // console.log(responseData);
    console.log(responseData);
        if (responseData && responseData.success) {
            localStorage.setItem('userID', (responseData.data._id).toString());

            window.location.href = "index2.html"; // Replace with your main page URL
        } else {    
        alert(responseData.error);}


}).catch(err => {
    alert(err.error);
    console.log(err);
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('initialbudget').value = '';
});

}

async function loginUser(event) {
    // event.prevent
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    // let initialbudget = document.getElementById('initialbudget').value;
    if (username == '' || password == '') {
        alert("please enter correct values!");
        return;
    }

await sendHttpRequest('POST', uriloginstr, {
        username: username,
        password: password,
    }).then(responseData => { // console.log(responseData);
        // console.log(responseData);
        if (responseData && responseData.success) {
            // console.log(responseData.data._id);

            localStorage.setItem('userID', `${responseData.data._id}`);

            window.location.href = "index2.html"; // Replace with your main page URL
        } else {
        alert(responseData.message);}


    }).catch(err => {
        alert(err.message);
        console.log(err);

        console.log(err);
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('initialbudget').value = '';
    });

}
