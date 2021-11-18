const Modal = {
  open() {
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    document
      .querySelectorAll(".modal-overlay input")
      .forEach(e => (e.value = ""));
    document.querySelector(".modal-overlay").classList.remove("active");
  }
};

const transactions = [
  {
    id: 1,
    description: "Luz",
    amount: -51563,
    date: "23/01/2021"
  },
  {
    id: 2,
    description: "Website",
    amount: 505058,
    date: "24/01/2021"
  },
  {
    id: 3,
    description: "Internet",
    amount: -21290,
    date: "25/01/2021"
  },
  {
    id: 4,
    description: "Gás",
    amount: -19990,
    date: "26/01/2021"
  },
  {
    id: 5,
    description: "Bolo",
    amount: -12215,
    date: "26/01/2021"
  }
];

const Transaction = {
  all: transactions,

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  income() {
    let income = 0;

    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });

    return income;
  },
  expenses() {
    let expenses = 0;

    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expenses += transaction.amount;
      }
    });

    return expenses;
  },
  total() {
    return Transaction.income() + Transaction.expenses();
  }
};

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction);

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction) {
    const cssClass = transaction.amount > 0 ? "income" : "expense";

    const amountFormatted = Utils.formatCurrency(transaction.amount);

    const html = `
        <td class="description">${transaction.description}</td>
        <td class="${cssClass}">${amountFormatted}</td>
        <td class="date">${transaction.date}</td>
        <td>
          <img src="./assets/minus.svg" alt="ícone remover transação" />
        </td>
      `;

    return html;
  },

  updateBalance() {
    let incomeFormatted = Utils.formatCurrency(Transaction.income());
    document.querySelector("#incomeDisplay").innerHTML = incomeFormatted;

    let expensesFormatted = Utils.formatCurrency(Transaction.expenses());
    document.querySelector("#expensesDisplay").innerHTML = expensesFormatted;

    let totalFormatted = Utils.formatCurrency(Transaction.total());
    document.querySelector("#totalDisplay").innerHTML = totalFormatted;
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  }
};

const Utils = {
  formatCurrency(value) {
    const sign = Number(value) < 0 ? "-" : "+";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

    return sign + " " + value;
  }
};

const App = {
  init() {
    Transaction.all.forEach(transaction => DOM.addTransaction(transaction));

    DOM.updateBalance();
  },

  reload() {
    DOM.clearTransactions();
    App.init();
  }
};

App.init();

Transaction.add({
  id: 6,
  description: "add Teste",
  amount: 200,
  date: "17/11/2021"
});
Transaction.add({
  id: 6,
  description: "reload Teste",
  amount: -100,
  date: "17/11/2021"
});
Transaction.add({
  id: 6,
  description: "add Teste",
  amount: 200,
  date: "17/11/2021"
});
Transaction.add({
  id: 6,
  description: "reload Teste",
  amount: -100,
  date: "17/11/2021"
});
