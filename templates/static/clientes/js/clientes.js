// Função para remover a lista de cadastro de carro na tela de cadastro de cliente
function remove_car(id) {
  var item = document.getElementById(id);

  item.remove();
}

// Função de adicionar a tela de input de carros na tela de cadastro de cliente
function add_carro() {
  // o idv vai servir como um id para função "remove_car"
  idv = Date.now();
  cont = document.getElementById("form-carro");

  // serve para criar os inputs de cadastro de carros
  html = `<div class='row' style="margin: 10px"  id=${idv}> <div class='col-md'> <input type='text' placeholder='carro' class='form-control' name='carro' > </div> <div class='col-md'><input type='text' placeholder='Placa' class='form-control' name='placa' ></div> <div class='col-md'> <input type='number' placeholder='ano' class='form-control' name='ano'> </div> <button class="btn btn-danger" onclick="remove_car(${idv})">X</button> </div>`;

  // coloca os inputs na tela
  cont.innerHTML += html;
}

// função para exibir add client / att client
function show_form(type) {
  add_client = document.getElementById("adicionar-cliente");
  att_client = document.getElementById("att_cliente");

  if (type == "1") {
    att_client.style.display = "none";
    add_client.style.display = "block";
  } else if (type == "2") {
    add_client.style.display = "none";
    att_client.style.display = "block";
  }
}

// função que vai atualizar os dados do cliente
function data_client() {
  select = document.getElementById("client-select");
  value = select.options[select.selectedIndex].value;

  // Esse é o Token, chave de tudo
  csrf_token = document.querySelector("[name=csrfmiddlewaretoken]").value;
  id_cliente = value;

  data = new FormData();
  data.append("id_cliente", id_cliente);

  // aqui já esta mandando pro banco de dados as mudanças
  fetch("/clientes/atualiza_cliente/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrf_token,
    },
    body: data,
  })
    // Os Then são as respostas bem sucedidas do banco
    .then(function (result) {
      return result.json();
    })
    .then(function (data) {
      document.getElementById("form-att-client").style.display = "block";
      // pegando as informações do banco e colocando no front
      id = document.getElementById("id");
      id.value = data["client_id"];
      nome = document.getElementById("nome");
      sobrenome = document.getElementById("sobrenome");
      email = document.getElementById("email");
      cpf = document.getElementById("cpf");
      sobrenome.value = data["cliente"]["sobrenome"];
      email.value = data["cliente"]["email"];
      cpf.value = data["cliente"]["cpf"];
      nome.value = data["cliente"]["nome"];

      // Já antecipando os dados na tela de exclusão
      exlcludename = document.getElementById("exludeName");
      exlcludename.value = data["cliente"]["nome"];
      escludecpf = document.getElementById("excludeCPF");
      escludecpf.value = data["cliente"]["cpf"];
      escludesobrenome = document.getElementById("excludeSobrenome");
      escludesobrenome.value = data["cliente"]["sobrenome"];
      escludeemail = document.getElementById("excludeEmail");
      escludeemail.value = data["cliente"]["email"];
      excludeid = document.getElementById("excludeId");
      excludeid.value = data["client_id"];

      // pegando onde vai ficar o html dos carros
      div_car = document.getElementById("carros");

      // resetando o html dos carros
      div_car.innerHTML = "";

      // inserindo os dados no html dos carros
      for (i = 0; i < data["carro"].length; i++) {
        div_car.innerHTML +=
          "<form id='update_car' action='/clientes/update_carro/" +
          data["carro"][i]["id"] +
          "' method='POST'>\
        <div class='row'>\
                <div class='col-md'>\
                    <input class='form-control' name='carro' type='text' value='" +
          data["carro"][i]["fields"]["carro"] +
          "'>\
                </div>\
                <div class='col-md'>\
                    <input class='form-control' name='placa' type='text' value='" +
          data["carro"][i]["fields"]["placa"] +
          "'>\
                </div>\
                <div class='col-md'>\
                    <input class='form-control' type='text' name='ano' value='" +
          data["carro"][i]["fields"]["ano"] +
          "' >\
                </div>\
                <div class='col-md'>\
                    <input class='btn btn-lg btn-success' type='submit' value='Salvar'>\
                </div>\
            </form>\
            <div class='col-md'>\
                <a href='/clientes/excluir_carro/" +
          data["carro"][i]["id"] +
          "' class='btn btn-lg btn-danger'>EXCLUIR</a>\
            </div>\
        </div><br>";
      }
    })
    // O catch são os erros
    .catch((err) => console.log(err));
}

// Remove o formulario de adicionar carro na tela de atualização de cliente
function canceladdcar() {
  div1 = document.getElementById("div1");
  div2 = document.getElementById("div2");

  div1.remove();
  div2.remove();
}

// Função que irá criar um novo carro para o Cliente
function newcar() {
  // Criando as variaveis
  const csrf_token = document.querySelector("[name=csrfmiddlewaretoken]").value;
  var id = document.getElementById("client-select").value;
  const carros = document.getElementsByName("ncarro");
  const placas = document.getElementsByName("nplaca");
  const anos = document.getElementsByName("nano");
  // construindo formulario
  const formData = new FormData();

  // adicionando o id, carro, placa e ano
  formData.append("id", id);

  for (let i = 0; i < carros.length; i++) {
    formData.append("ncarro", carros[i].value);
    formData.append("nplaca", placas[i].value);
    formData.append("nano", anos[i].value);
  }
  // mandando os dados pro backend, na def "newcar"
  fetch("/clientes/new_car/", {
    method: "POST",
    headers: {
      "x-CSRFToken": csrf_token,
    },
    body: formData,
  })
    .then(function (result) {
      return result.json();
    })
    .then(async function (data) {
      await data;
      // aqui o código espera uma resposta do back pra fazer reload na pagian com os dados salvos
      return window.location.reload();
    })
    .catch((err) => console.log(err));
}

// função para adicionar um novo carro para um cliente já cadastrado
function add_new_car() {
  // Criando os elementos
  input1 = document.createElement("input");
  input2 = document.createElement("input");
  input3 = document.createElement("input");
  btn1 = document.createElement("input");
  btn2 = document.createElement("input");
  // Adicioanndo as classes necessarias
  input1.classList.add("form-control");
  input2.classList.add("form-control");
  input3.classList.add("form-control");
  input1.classList.add("w-25");
  input2.classList.add("w-25");
  input3.classList.add("w-25");
  btn1.classList.add("btn");
  btn1.classList.add("btn-success");
  btn1.classList.add("w-100");
  btn2.classList.add("w-100");
  btn2.classList.add("btn");
  btn2.classList.add("btn-danger");
  btn2.classList.add("margin-bot");
  // Adicionando as propriedades necessarias
  btn1.value = "Salvar";
  // btn1.type = "submit";
  btn2.value = "Cancelar";
  btn2.type = "submit";
  input1.placeholder = "carro";
  input1.name = "ncarro";
  input1.setAttribute("id", "ncarro");
  input1.type = "text";
  input2.placeholder = "placa";
  input2.name = "nplaca";
  input2.setAttribute("id", "nplaca");
  input3.placeholder = "ano";
  input3.name = "nano";
  input3.setAttribute("id", "nano");
  input3.type = "number";
  // Atribuindo na tela
  html = document.getElementById("add_ncar");

  div = document.createElement("div");
  div2 = document.createElement("div");
  div.setAttribute("id", "div1");
  div2.setAttribute("id", "div2");
  // colocando uma function
  btn1.addEventListener("click", newcar);
  btn2.addEventListener("click", canceladdcar);

  div.classList.add("d-flex");
  div.classList.add("flex-row");
  div.classList.add("bd-highlight");
  div.classList.add("justify-content-between");
  div2.classList.add("d-flex");
  div2.classList.add("flex-row");
  div2.classList.add("bd-highlight");
  div2.classList.add("justify-content-between");
  div2.classList.add("margin-bot");

  div.appendChild(input1);
  div.appendChild(input2);
  div.appendChild(input3);

  div2.appendChild(btn1);
  div2.appendChild(btn2);

  html.appendChild(div);
  html.appendChild(div2);
}

// Escondendo a tela de exclusão de usuario
function hideMessage() {
  message = document.getElementById("message");

  message.classList.remove("hidden");
}

// função para criar a tela de excluir cliente
// id = document.getElementById("excludeId").value;
function exlude_cliente() {
  // pegando dados do input
  nome = document.getElementById("exludeName").value;
  sobrenome = document.getElementById("excludeSobrenome").value;
  email = document.getElementById("excludeEmail").value;
  cpf = document.getElementById("excludeCPF").value;
  id = document.getElementById("excludeId").value;
  csrf_token = document.querySelector("[name=csrfmiddlewaretoken]").value;
  // mandando os dados para view update_cliente, com metodo de deletar
  fetch("/clientes/update_cliente/" + id, {
    method: "DELETE",
    headers: {
      "X-CSRFToken": csrf_token,
    },
    body: JSON.stringify({
      nome: nome,
      sobrenome: sobrenome,
      email: email,
      cpf: cpf,
      id: id,
    }),
  })
    .then(function (result) {
      return result.json();
    })
    // Pegando os dados do back e trazendo pro front
    .then(function (data) {
      if (data["status"] == "200") {
        nome = data["nome"];
        sobrenome = data["sobrenome"];
        email = data["email"];
        cpf = data["cpf"];
        id = data["id"];
        console.log("Dados alterados com sucesso"); //TODO atualizar e deixa com o cliente atualizado selecionado no select
      } else {
        console.log("Ocorreu um erro inesperado no servidor de dados");
      }
    })
    .catch((err) => console.log(err));

  window.location.reload();
}

// funcão que cancela botão de excluir cliente
function cancel() {
  dom = document.getElementById("message");
  att = document.getElementById("att_cliente");

  dom.classList.add("hidden");
}

// Função de atualizar cliente
function update_client() {
  // Pegando os dados
  nome = document.getElementById("nome").value;
  sobrenome = document.getElementById("sobrenome").value;
  email = document.getElementById("email").value;
  cpf = document.getElementById("cpf").value;
  id = document.getElementById("id").value;
  csrf_token = document.querySelector("[name=csrfmiddlewaretoken]").value;

  // Mandando para o back end
  fetch("/clientes/update_cliente/" + id, {
    method: "POST",
    headers: {
      "X-CSRFToken": csrf_token,
    },
    body: JSON.stringify({
      nome: nome,
      sobrenome: sobrenome,
      email: email,
      cpf: cpf,
    }),
  })
    .then(function (result) {
      return result.json();
    })
    // Pegando os dados do back e trazendo pro front
    .then(function (data) {
      if (data["status"] == "200") {
        nome = data["nome"];
        sobrenome = data["sobrenome"];
        email = data["email"];
        cpf = data["cpf"];
        console.log("Dados alterados com sucesso"); //TODO atualizar e deixa com o cliente atualizado selecionado no select
      } else {
        console.log("Ocorreu um erro inesperado no servidor de dados");
      }
    })
    .catch((err) => console.log(err));
}
