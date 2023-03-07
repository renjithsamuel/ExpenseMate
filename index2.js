let imgsrcbill = "assets/images/bill.png";
let imgsrcclose = "assets/images/close.png";

const userID = localStorage.getItem('userID');
console.log(userID);
let uribudget = `https://expensemate.onrender.com/api/v1/user/${userID}`
let uriexpenses = `https://expensemate.onrender.com/api/v1/expensebyuser/${userID}`; 
let uriexpensepost = `https://expensemate.onrender.com/api/v1/expenses`;
// let uridelete = `https://expensemate.onrender.com/api/v1/expense/${id}`;
// uritotalbudget = `http://localhost:80/api/v1/expenses/${userID}`






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

function getData() {
    console.log(userID);

    sendHttpRequest('GET', uriexpenses).then(responseData => {
        // console.log(responseData);
        var cardWrap = document.getElementById('cardsWrapper');
        cardWrap.innerHTML = " ";
        // console.log(cardWrap);
        responseData.data.forEach(element => {
            createCard(element);
        });
        return cardWrap;
    });
}


function createCard(element) {
    var cardWrap = document.getElementById('cardsWrapper');
    var card = getcard();
    var exp = element.amount;
    var name = element.name;
    // console.log(element);
    var date = new Date(element.date); // Parse the string date into a date object

    let newdate = '';
    if (date) {
        const day = date.toLocaleDateString('en-US', {
            day: 'numeric',});
        const month = date.toLocaleDateString('en-US', {
            month: 'short',});
        const year = date.toLocaleDateString('en-US', {
            year: 'numeric',});
        newdate = day+" "+month+" "+year;
    }
    console.log(newdate);
    card.querySelector('.amountspent').innerHTML = "Rs. " + exp;
    card.querySelector('.detailname').innerHTML = name;
    card.querySelector('.detaildate').innerHTML = newdate;
    card.setAttribute("id", element._id);
    card.querySelector('.popbutton').setAttribute("onclick", `deleteData('${
        card.id
    }')`);
    
    cardWrap.appendChild(card);
}




async function getBudget() {
    let budgetdata;
    await sendHttpRequest('GET', uribudget).then(responseData => {
        console.log(responseData);
        var navbar = document.getElementById('navbar');
        navbar.innerHTML = "Hi " + responseData.data.username;
        const totalbudget = document.getElementById('totalbalance');
        totalbudget.innerHTML = "Rs. "+responseData.data.amount;
        budgetdata = responseData.data.amount;
        // console.log(budgetdata);
    })
    setBudgetColor();
    // console.log(budgetdata);
    return budgetdata;
}



async function updateBudget() {
    const updateBudget = document.getElementById('updateBudget').value;
    
    if(isNaN(updateBudget)) {
        alert("Please Enter Valid Values")
        return;
    }
    // parseInt(updateBudget);
    if (updateBudget == '') {
        console.log("send correct values");
        return;
    }
    console.log(updateBudget);
    sendHttpRequest('PUT', uribudget, {amount: updateBudget}).then(responseData => {
        getBudget();
        console.log(responseData);
    }).catch((err) => {
        console.log(err);
    });
    // console.log(typeof  updateBudget);
    // decreseBudget((await getBudget()) + updateBudget);
    // await getBudget();
}

// let day = date.getDate();
// console.log(day);

// let month = date.getMonth();
// console.log(month + 1);

// let year = date.getFullYear();
// console.log(year);

// console.log(date);


async function postData() { // const cardWrap = getData();
    const name = document.getElementById('nameTextField').value;
    const amt = document.getElementById('amtTextField').value;
    let date = document.getElementById('dateField').value;

    let newdate = '';
    if(date){
    const [year, month, day] = date.split('-');
    newdate = `${year},${month},${day}`;
    }else{
        newdate = new Date();
        newdate = newdate.toString();
    }

    if(amt == '' || name == '') {alert("please enter some values!");return;}
    if(amt<0) {alert("Amount can't be negative");return};
    if(isNaN(amt)) {
        alert("Please Enter Valid Values")
        return;
    }

    decreseBudget((await getBudget()) - amt);
    await sendHttpRequest('POST', uriexpensepost, {
        name: name,
        amount: amt,
        desc: "",
        date : newdate,
        user : userID
    }).then(responseData => { // console.log(responseData);
        console.log(responseData);
        createCard(responseData);
        getBudget();
    }).catch(err => {
        console.log(err);
    });
    document.getElementById('nameTextField').value = '';
    document.getElementById('amtTextField').value = '';
    document.getElementById('dateField').value = '';
};


function decreseBudget(updateBudget) {
    console.log(updateBudget);
    sendHttpRequest('PUT', uribudget, {amount: updateBudget}).then(responseData => {
        getBudget();
        console.log(responseData);
    }).catch((err) => {
        console.log(err);
    });
}

async function deleteData(id) {
    const card = document.getElementById(id);
    // const name = namecont.innerHTML;
    console.log(id);
    let amt;
    await sendHttpRequest('DELETE', `https://expensemate.onrender.com/api/v1/expense/${id}`).then((val) => {
        console.log(val.element.amount);
         amt = (val.element.amount)
        }).catch((err) => {
            console.log(err.error);
        });
        
        decreseBudget((await getBudget()) + amt);
         await getBudget();
    await getData();
    card.remove();
};


function getcard() {
    let card = document.createElement("div");
    card.setAttribute("class", "card");
    let left = document.createElement("div");
    left.setAttribute("class", "left");
    let iconpayment = document.createElement("div");
    iconpayment.setAttribute("class", "iconpayment");

    let billing = document.createElement("img");
    billing.setAttribute("class", "billing");
    billing.setAttribute("src", imgsrcbill);
    iconpayment.appendChild(billing);

    left.appendChild(iconpayment);
    let details = document.createElement("div");
    details.setAttribute("class", "details");

    let detailname = document.createElement("div");
    detailname.setAttribute("class", "detailname");
    details.appendChild(detailname);

    let detaildate = document.createElement("div");
    detaildate.setAttribute("class", "detaildate");
    details.appendChild(detaildate);
    left.appendChild(details);
    card.appendChild(left);

    let right = document.createElement("div");
    right.setAttribute("class", "right");
    let amountspent = document.createElement("div");
    amountspent.setAttribute("class", "amountspent");
    right.appendChild(amountspent);
    let popbutton = document.createElement("div");
    popbutton.setAttribute("class", "popbutton");
    let closeimg = document.createElement("img");
    closeimg.setAttribute("class", "closeimg");
    closeimg.setAttribute("src", imgsrcclose);
    popbutton.appendChild(closeimg);
    right.appendChild(popbutton);
    card.appendChild(right);

    return card;
}

function toggleEditBudget() {
    var btn = document.getElementById('toggleBudgetButton');
    btn.style.transform = 'rotate(45deg)';
    var x = document.getElementById("editbar");
    if (x.style.display === "none") {
        setTimeout( x.style.display = "block",1000);
        x.style.animation = "moveRight 0.4s  ease-in-out forwards";
        btn.style.transform = 'rotate(45deg)';

    } else {
        x.style.animation = "moveLeft 0.4s  ease-in-out forwards";
        setTimeout( x.style.display = "none",1000);
        btn.style.transform = 'rotate(0deg)';
    }


}

function setBudgetColor(){
    let val = document.getElementById('totalbalance');
    if(val.innerHTML.slice(4)<0){
        val.style.color = 'red';
    }else{
        val.style.color = 'green';
    }
}



function showLogoutDialog() {
// var x = document.getElementById("toggleeditbutton");
var y = document.getElementById('dollars');
y.style.display = 'none';

document.getElementById("logoutDialog").style.display = "block";
document.getElementById("logoutBackdrop").style.display = "block";
}

function hideLogoutDialog() {
    var y = document.getElementById('dollars');
y.style.display = 'flex';
document.getElementById("logoutDialog").style.display = "none";
document.getElementById("logoutBackdrop").style.display = "none";
}

function logout() {
// perform logout action here
window.location.href = "index.html";
hideLogoutDialog();
}