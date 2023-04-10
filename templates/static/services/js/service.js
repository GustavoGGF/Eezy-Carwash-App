var selectService = document.getElementById("Cliente-Service");

selectService.addEventListener("change", () => {
  const id = selectService.options[selectService.selectedIndex].value;
  const csrf_token = document.querySelector("[name=csrfmiddlewaretoken]").value;

  fetch("/servicos/novo_servico/", {
    method: "POST",
    headers: {
      "X-CSRFToken": csrf_token,
    },
    body: id,
  })
    .then(function (result) {
      console.log("teste");
      return result.json();
    })
    .then(function (data) {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
});
