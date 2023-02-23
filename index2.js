let imgsrc = "assets/images/bill.png";
let uriexpenses = "http://localhost:80/api/v1/expenses";
let uritotalbudget = "http://localhost:80/api/v1/totalbudget"


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
    sendHttpRequest('GET', uriexpenses).then(responseData => {
        var cardWrap = document.getElementById('cardsWrapper');
        cardWrap.innerHTML = " ";
        // console.log(cardWrap);
        responseData.data.forEach(element => {
            createCard(element);
        });
        return cardWrap;
    });
}

// function getData(){
//     sendHttpRequest('GET', 'http://localhost:80/api/v1/expenses').then(responseData => {
//         // console.log(responseData.data);
//         const table = document.createElement('table');
//         const tableBody = document.createElement('tbody');
//         var row = document.createElement("tr");
//         var name = document.createElement("th");
//         var amt = document.createElement("th");
//         var desc = document.createElement("th");

//         name.innerHTML = "NAME";
//         amt.innerHTML = "AMOUNT";
//         desc.innerHTML = "DESCRIPTION";

//         row.appendChild(name)
//         row.appendChild(amt);
//         row.appendChild(desc);

//         tableBody.appendChild(row);

//         name.setAttribute('border', '1px solid')
//         amt.setAttribute('border', '1px solid')
//         desc.setAttribute('border', '1px solid')

//         responseData.data.forEach(element => {
//             row = document.createElement("tr");
//             name = document.createElement("td");
//             amt = document.createElement("td");
//             desc = document.createElement("td");
//             name.innerHTML = element.name;
//             amt.innerHTML = element.amount;
//             desc.innerHTML = element.desc;

//             row.appendChild(name);
//             row.appendChild(amt);
//             row.appendChild(desc);
//             tableBody.appendChild(row);

//             name.setAttribute('border', '1px solid')
//             amt.setAttribute('border', '1px solid')
//             desc.setAttribute('border', '1px solid')
//         });
//         // console.log(tableBody)
//         table.appendChild(tableBody);
//         document.body.appendChild(table);
//         // table, td, th {
//         //     border: 1px solid;
//         //   }


//         table.setAttribute('width', '100%')
//         table.setAttribute('border-collapse', 'collapse')
//         table.setAttribute('border', '1px solid')
// });
// };

function createCard(element) {
    var cardWrap = document.getElementById('cardsWrapper');
    var card = getcard();
    var exp = element.amount;
    var name = element.name;
    // console.log(element);

    card.querySelector('.amountspent').innerHTML = exp;
    card.querySelector('.detailname').innerHTML = name;
    card.setAttribute("id", element._id);
    card.querySelector('.popbutton').setAttribute("onclick", `deleteData('${
        element._id
    }')`);

    cardWrap.appendChild(card);
}

async function getBudget() {
    let budgetdata;
    await sendHttpRequest('GET', uritotalbudget).then(responseData => {
        const totalbudget = document.getElementById('totalbalance');
        totalbudget.innerHTML = "Rs. "+responseData.data;
        budgetdata = responseData.data;
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
    sendHttpRequest('PUT', uritotalbudget, {amount: updateBudget}).then(responseData => {
        getBudget();
        console.log(responseData);
    }).catch((err) => {
        console.log(err);
    });
    // console.log(typeof  updateBudget);
    // decreseBudget((await getBudget()) + updateBudget);
    // await getBudget();
}

async function postData() { // const cardWrap = getData();
    const name = document.getElementById('nameTextField').value;
    const amt = document.getElementById('amtTextField').value;
    if(isNaN(amt)) {
        alert("Please Enter Valid Values")
        return;
    }
    // if(typeof amt != Number){console.log("Send correct values");return;}
    // console.log(await getBudget());
    decreseBudget((await getBudget()) - amt);
    await sendHttpRequest('POST', uriexpenses, {
        name: name,
        amount: amt,
        desc: ""
    }).then(responseData => { // console.log(responseData);
        createCard(responseData);
        getBudget();
    }).catch(err => {
        console.log(err);
    });
    document.getElementById('nameTextField').value = '';
    document.getElementById('amtTextField').value = '';
};


function decreseBudget(updateBudget) {
    console.log(updateBudget);
    sendHttpRequest('PUT', uritotalbudget, {amount: updateBudget}).then(responseData => {
        getBudget();
        console.log(responseData);
    }).catch((err) => {
        console.log(err);
    });
}

async function deleteData(id) {
    const card = document.getElementById(id);
    // const name = namecont.innerHTML;
    // console.log(id);
    let amt;
    await sendHttpRequest('DELETE', 'http://localhost:80/api/v1/expenses', {_id: id}).then((val) => {
        console.log(val.element.amount);
         amt = (val.element.amount)
        }).catch((err) => {
            console.log(err.error);
        });
        
        decreseBudget((await getBudget()) + amt);
         await getBudget();
    // getData();
    card.remove();
}


// function deleteCard(name){
//     const cardWrap = document.getElementById('cardsWrapper');
//     let name = cardWrap.querySelector(".detailname");
//     deleteData(name);
// }

function getcard() {
    let card = document.createElement("div");
    card.setAttribute("class", "card");
    let left = document.createElement("div");
    left.setAttribute("class", "left");
    let iconpayment = document.createElement("div");
    iconpayment.setAttribute("class", "iconpayment");

    let billing = document.createElement("img");
    billing.setAttribute("class", "billing");
    billing.setAttribute("src", imgsrc);
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
    right.appendChild(popbutton);
    card.appendChild(right);

    return card;
}

function toggleEditBudget() {
    var x = document.getElementById("editbar");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
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

// console.log(getcard());
