const form = document.getElementById('form-detail');
const il = document.getElementById('listOfExpenses');

async function saveToLocalStorage(event) {
  event.preventDefault();
  const amount = document.getElementById('amount').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;
  const expense = {
    amount,
    description,
    category
  };
  
try {
    await axios.post("http://localhost:2000/expense/add-expense", expense);
    refreshExpenses(); 
  } catch (err) {
    console.error(err);
  }
}

async function refreshExpenses() {
  try {
    const res = await axios.get("http://localhost:2000/expense/get-expense");
    il.innerHTML = ''; //clear the current expense list
    for (let i = 0; i < res.data.allExpenses.length; i++) {
      showExpenses(res.data.allExpenses[i]);
    }
    // clear form field
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('category').value ='';
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await axios.get("http://localhost:2000/expense/get-expense");
    for (let i = 0; i < res.data.allExpenses.length; i++) {
      showExpenses(res.data.allExpenses[i]);
      refreshExpenses();
    }
  } catch (err) {
    console.error(err);
  }
});

function showExpenses(user){
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('category').value ='';

  const parentNode = document.getElementById('listOfExpenses');
  const childHTML = `<li id=${user.id} > ${user.amount} - ${user.description} - ${user.category} 
                         <button onclick=deleteExpense('${user.id}')> Delete Expense </button>
                      </li>`

  parentNode.innerHTML += childHTML;
}

async function deleteExpense(userId) {
  try {
    await axios.delete(`http://localhost:2000/expense/delete-expense/${userId}`);
    removeExpense(userId);
    refreshExpenses();
  } catch (err) {
    console.log(err);
  }
};


function removeExpense(userid) {
    const expenseToBeDeleted = document.getElementById(`${userid}`);
    if (expenseToBeDeleted != null) {
        il.removeChild(expenseToBeDeleted);
    }
}