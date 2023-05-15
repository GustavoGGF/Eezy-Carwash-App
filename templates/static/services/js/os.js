async function postDescription() {
  const descricao = await document.getElementById("description").value;
  const identificador = await document.getElementById("identificador").value;
  const csrf_token = document.querySelector("[name=csrfmiddlewaretoken]").value;

  fetch(`/servicos/salvar_os/${identificador}`, {
    method: "POST",
    headers: {
      "X-CSRFToken": csrf_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ descricao: descricao }),
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Erro na requisição: " + response.status);
      }
    })
    .then(async function (data) {
      await data;
      return location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
}
