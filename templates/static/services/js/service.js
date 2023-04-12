// Esse código tem como função trazer o carro do banco de dados quando seleciona o cliente
var selectService = document.getElementById("Cliente-Service");

selectService.addEventListener("change", () => {
  if (document.getElementById("seletor-carro") !== null) {
    Car_select.remove();
    cars();
  } else {
    cars();
  }
  function cars() {
    const id = selectService.options[selectService.selectedIndex].value;
    const csrf_token = document.querySelector(
      "[name=csrfmiddlewaretoken]"
    ).value;

    fetch("/servicos/novo_servico/", {
      method: "POST",
      headers: {
        "X-CSRFToken": csrf_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then(function (result) {
        return result.json();
      })
      .then(async function (data) {
        Car_service = document.getElementById("car-service");

        Car_select = document.createElement("select");
        Car_select.setAttribute("id", "seletor-carro");
        var adjust = document.createElement("option");
        adjust.textContent = "Escolha um veiculo";
        Car_select.appendChild(adjust);
        Car_select.classList.add("form-control");
        Car_select.name = "carro";

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
