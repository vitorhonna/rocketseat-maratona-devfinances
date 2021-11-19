const Modal = {
  open() {
    document.querySelector(".modal-overlay").classList.add("active");
  },

  close() {
    document
      .querySelectorAll(".modal-overlay input")
      .forEach((e) => (e.value = ""));

    document.querySelector(".modal-overlay").classList.remove("active");
  },
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },

  set(transactions) {
    localStorage.setItem(
      "dev.finances:transactions",
      JSON.stringify(transactions)
    );
  },
};

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  income() {
    let income = 0;

    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });

    return income;
  },

  expenses() {
    let expenses = 0;

    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expenses += transaction.amount;
      }
    });

    return expenses;
  },

  total() {
    return Transaction.income() + Transaction.expenses();
  },
};

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const cssClass = transaction.amount > 0 ? "income" : "expense";

    const amountFormatted = Utils.formatCurrency(transaction.amount);

    const html = `
        <td class="description">${transaction.description}</td>
        <td class="${cssClass}">${amountFormatted}</td>
        <td class="date">${transaction.date}</td>
        <td>
          <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="ícone remover transação" />
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
  },
};

const Utils = {
  formatCurrency(value) {
    const sign = Number(value) < 0 ? "-" : "+";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return sign + " " + value;
  },

  formatAmount(value) {
    value = value.replace(",", ".");
    value = Math.round(Number(value) * 100);
    if (isNaN(value)) {
      throw new Error("O valor da transação deve ser um número");
    }
    return value;
  },

  formatDate(date) {
    const dateArray = date.split("-");
    return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
  },
};

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = Form.getValues();

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateFields();
      const transaction = Form.formatValues();
      Transaction.add(transaction);
      Form.clearFields();
      Modal.close();
      //
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    // Transaction.all.forEach((transaction, index) => {
    //   DOM.addTransaction(transaction, index);
    // });

    // É equivalente a:
    Transaction.all.forEach(DOM.addTransaction);

    DOM.updateBalance();

    Storage.set(Transaction.all);
  },

  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

console.clear();

App.init();
