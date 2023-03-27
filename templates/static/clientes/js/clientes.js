function remove_car(id) {
  var item = document.getElementById(id);

  item.remove();
}

function add_carro() {
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
  console.log(value);
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

function add_new_car() {}

// function exlude_cliente() {
//   alerta = document.createElement("div");

//   home = document.getElementById("home");

//   att = document.getElementById("att_cliente");

//   att.classList.add("blur");

//   alerta.classList.add("alert");
//   alerta.setAttribute("id", "alerta");

//   nome = document.getElementById("nome").value;
//   sobrenome = document.getElementById("sobrenome").value;
//   cpf = document.getElementById("cpf").value;

//   text = `<button class="btn btn-danger w-25 cancel" onclick="cancel()">X</button><h3 style="margin-top: 50px">Você tem certeza que deseja excluir</h3><br/><h4>Nome: ${nome} ${sobrenome}</h4><br/><h3>Portador do CPF:</h3<br/><p>${cpf}</p><br/><br/><input class="btn btn-danger w-50" type="submit" value="SIM"/>`;

//   alerta.innerHTML += text;

//   home.appendChild(alerta);
// }

function cancel() {
  dom = document.getElementById("alerta");
  att = document.getElementById("att_cliente");
  att.classList.remove("blur");

  dom.remove();
}

// Função de atualizar cliente
function update_client() {
  // Pegando os dados
  nome = document.getElementById("nome").value;
  sobrenome = document.getElementById("sobrenome").value;
  email = document.getElementById("email").value;
  cpf = document.getElementById("cpf").value;
  id = document.getElementById("id").value;

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
