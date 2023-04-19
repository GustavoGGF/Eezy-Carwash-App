// Esse código tem como função trazer o carro do banco de dados quando seleciona o cliente
var selectService = document.getElementById("Cliente-Service");

// o select é ativado cada vez que o seu valor for mudado
selectService.addEventListener("change", () => {
  // variavel para veificar se algum cliente já foi selecionado
  if (document.getElementById("seletor-carro") !== null) {
    // caso sim, ira remover a lista de carros e rodar novamente para não ficar sempre na tela uma lista anterior
    Car_select.remove();
    cars();
  } else {
    cars();
  }

  function cars() {
    // pegando o id
    var id = selectService.options[selectService.selectedIndex].value;
    const csrf_token = document.querySelector(
      "[name=csrfmiddlewaretoken]"
    ).value;
    fetch("/servicos/novo_servico/", {
      method: "POST",
      headers: {
        "X-CSRFToken": csrf_token,
        "Content-Type": "application/json",
      },
      // Jogando o id para um JSON
      body: JSON.stringify({ id: id }),
    })
      .then(function (result) {
        return result.json();
      })
      .then(async function (data) {
        // esse código é so criando elementos na tela e colocando o nome do carro do cliente selecionado nas options
        Car_service = document.getElementById("car-service");

        Car_select = document.createElement("select");
        Car_select.setAttribute("id", "seletor-carro");
        var adjust = document.createElement("option");
        adjust.textContent = "Escolha um veiculo";
        Car_select.appendChild(adjust);
        Car_select.classList.add("form-control");
        Car_select.name = "carro";
        Car_select.required = true;

        carros = JSON.parse(data);

        const carNames = [];

        await carros.forEach((carro) => {
          if (!carNames.includes(carro.carro)) {
            const opt = document.createElement("option");
            opt.textContent = carro.carro;
            opt.value = carro.id;

            Car_select.appendChild(opt);
            carNames.push(carro.carro);
          }
        });

        Car_service.appendChild(Car_select);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

function createService() {
  // pegando o id
  var id = selectService.options[selectService.selectedIndex].value;
  const csrf_token = document.querySelector("[name=csrfmiddlewaretoken]").value;
  var title = document.getElementById("tituloServ").value;
  var servicesTypes = document.querySelectorAll('input[type="checkbox"]');
  var startDate = document.getElementById("startDate").value;
  var endDate = document.getElementById("endDate").value;
  const selectCar = document.getElementById("seletor-carro");
  var car = selectCar.options[selectCar.selectedIndex].value;
  const servicesSelect = [];

  let incio = new Date(startDate);
  let fim = new Date(endDate);

  if (fim < incio) {
    return;
  }

  if (selectCar.value == "Escolha um veiculo") {
    return;
  }

  let noneSelected = true;

  servicesTypes.forEach(function (checkbox) {
    if (checkbox.checked) {
      servicesSelect.push(checkbox.value);

      noneSelected = false;
    }
  });

  if (noneSelected) {
    return;
  }

  fetch("/servicos/listar_servico/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrf_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      titulo: title,
      servico: servicesSelect,
      inicio_servico: startDate,
      final_servico: endDate,
      carro: car,
    }),
  })
    .then(function (result) {
      return result.json();
    })
    .then(function (data) {
      window.location.reload();
    })
    .catch((err) => console.log(err));
}

function excludeService(botao) {
  var identificador = botao.parentNode.parentNode.querySelector(
    "td:nth-of-type(1) a"
  ).textContent;

  const csrf_token = document.querySelector("[name=csrfmiddlewaretoken]").value;

  fetch("/servicos/listar_servico/", {
    method: "DELETE",
    headers: {
      "X-CSRFToken": csrf_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identificador: identificador }),
  })
    .then(function (result) {
      return result.json();
    })
    .then(function (data) {
      return window.location.reload();
    })
    .catch((err) => console.log(err));
}
