var selectService = document.getElementById("Cliente-Service");

selectService.addEventListener("change", () => {
  const id = selectService.options[selectService.selectedIndex].value;
  const csrf_token = document.querySelector("[name=csrfmiddlewaretoken]").value;

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
      await data;

      Car_service = document.getElementById("car-service");

      Car_select = document.createElement("select");
      Car_select.classList.add("form-control");
      Car_select.name = "carro";

      Car_service.appendChild(Car_select);

      console.log(data.json());
    })
    .catch((err) => {
      console.log(err);
    });
});
