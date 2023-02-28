const getBtn = document.getElementById('get-btn');
const postBtn = document.getElementById('post-btn');

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

function getData(){
    sendHttpRequest('GET', 'http://localhost:80/api/v1/expenses').then(responseData => {
        const tableBody = document.getElementById('tablebody');
        let tableRows = '';
        responseData.data.forEach(element => {
            tableRows += `<tr><td>${element.name}</td><td>${element.amount}</td><td>${element.desc}</td></tr>`;
        });
        tableBody.innerHTML = tableRows;
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
//   });
// };

function postData(){
    const name = document.getElementById('nameTextField').value;
    const amt = document.getElementById('amtTextField').value;
    const desc = document.getElementById('expTextField').value;

  sendHttpRequest('POST', 'http://localhost:80/api/v1/expenses', {
    name : name,
    amount:amt,
    desc:desc

  })
    .then(responseData => {
      console.log(responseData);
    })
    .catch(err => {
      console.log(err);
    });
};

function deleteData(){
    const name = document.getElementById('dltTextField').value;
    if(name == "") {
        alert("Enter Name to delete");
        return;
    }
    sendHttpRequest('DELETE','http://localhost:80/api/v1/expenses',{
        name : name
    }).then((val)=>{
        console.log(val.element);
    }).catch((err)=>{
        console.log(err.error);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
  });
  
