// array de tareas
// cada tarea tiene texto, estado, y hora de creación
let todos = [
  { texto: "Instalar hidráulicos en Voodoo",     completada: false, hora: "09:00" },
  { texto: "Pintura custom en Faction",           completada: true,  hora: "09:15" },
  { texto: "Tapicería de terciopelo en Lowrider", completada: false, hora: "10:30" },
  { texto: "Llantas Moonbeam personalizadas",     completada: true,  hora: "11:00" },
  { texto: "Motor turbo en Sabre",                completada: false, hora: "11:45" },
];

// filtro activo — puede ser "todas", "pendientes" o "completadas"
let filtroActivo = "todas";

// modo oscuro — por defecto desactivado
let modoOscuro = false;

// límite de caracteres del input
const LIMITE_CARACTERES = 80;


const listaTareas            = document.querySelector(".lista-tareas");
const inputTarea             = document.querySelector("#input-tarea");
const formulario             = document.querySelector(".formulario");
const btnEliminarCompletadas = document.querySelector(".btn-secundario");
const btnEliminarTodas       = document.querySelector(".btn-peligro");
const mensajeVacio           = document.querySelector(".lista-vacia");
const mensajeTodoListo       = document.querySelector(".mensaje-todo-listo");
const contadorChars          = document.querySelector(".contador-chars");
const btnAñadir              = document.querySelector(".btn-primario");
const filtros                = document.querySelector(".filtros");
const avisoLiveRegion        = document.querySelector(".aviso-live");
const btnModo                = document.querySelector(".btn-modo");
const btnDesmarcarTodas      = document.querySelector(".btn-desmarcar");


// ---- PERSISTENCIA CON LOCALSTORAGE ----
function guardarEnStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("modoOscuro", JSON.stringify(modoOscuro));
  localStorage.setItem("filtroActivo", filtroActivo);
}

function cargarDeStorage() {
  const guardadas = localStorage.getItem("todos");
  if (guardadas) todos = JSON.parse(guardadas);

  const modoGuardado = localStorage.getItem("modoOscuro");
  if (modoGuardado) modoOscuro = JSON.parse(modoGuardado);

  const filtroGuardado = localStorage.getItem("filtroActivo");
  if (filtroGuardado) filtroActivo = filtroGuardado;
}


// ---- MODO OSCURO / CLARO ----
function aplicarModo() {
  if (modoOscuro) {
    document.body.classList.add("modo-oscuro");
    if (btnModo) btnModo.textContent = "☀️ Modo claro";
  } else {
    document.body.classList.remove("modo-oscuro");
    if (btnModo) btnModo.textContent = "🌙 Modo oscuro";
  }
}

function toggleModo() {
  modoOscuro = !modoOscuro;
  aplicarModo();
  guardarEnStorage();
}


// ---- HORA ACTUAL ----
// devuelve la hora actual en formato HH:MM
function obtenerHora() {
  const ahora = new Date();
  const horas   = String(ahora.getHours()).padStart(2, "0");
  const minutos = String(ahora.getMinutes()).padStart(2, "0");
  return horas + ":" + minutos;
}


// ---- FILTRADO ----
function obtenerTareasFiltradas() {
  // pendientes primero, completadas al final
  const pendientes  = todos.filter(function(t) { return !t.completada; });
  const completadas = todos.filter(function(t) { return t.completada; });
  const ordenadas   = pendientes.concat(completadas);

  if (filtroActivo === "pendientes") {
    return ordenadas.filter(function(t) { return !t.completada; });
  }
  if (filtroActivo === "completadas") {
    return ordenadas.filter(function(t) { return t.completada; });
  }
  return ordenadas;
}


// ---- RENDERIZADO ----
function renderTodos() {
  listaTareas.innerHTML = "";

  const tareasFiltradas = obtenerTareasFiltradas();
  const totalCompletadas = todos.filter(function(t) { return t.completada; }).length;

  // mensaje lista vacía
  if (tareasFiltradas.length === 0) {
    mensajeVacio.style.display = "block";
  } else {
    mensajeVacio.style.display = "none";
  }

  // mensaje "todo listo" cuando todas están completadas
  if (todos.length > 0 && totalCompletadas === todos.length) {
    mensajeTodoListo.style.display = "block";
  } else {
    mensajeTodoListo.style.display = "none";
  }

  tareasFiltradas.forEach(function(tarea) {
    const indiceReal = todos.indexOf(tarea);

    const li = document.createElement("li");
    li.classList.add("tarea");
    if (tarea.completada) li.classList.add("tarea-completada");

    li.innerHTML = `
      <div class="tarea-contenido">
        <input
          class="tarea-checkbox"
          type="checkbox"
          id="tarea-${indiceReal}"
          name="tarea-${indiceReal}"
          ${tarea.completada ? "checked" : ""}
        >
        <label class="tarea-label" for="tarea-${indiceReal}">
          <span class="tarea-check-visual" aria-hidden="true"></span>
          <div class="tarea-info">
            <span class="tarea-texto">${tarea.texto}</span>
            ${tarea.hora ? `<span class="tarea-hora">${tarea.hora}</span>` : ""}
          </div>
        </label>
      </div>
      <div class="tarea-acciones">
        <p class="tarea-estado ${tarea.completada ? "tarea-estado-lista" : "tarea-estado-pendiente"}">
          ${tarea.completada ? "Listo" : "En cola"}
        </p>
        <button class="btn-eliminar-tarea" data-indice="${indiceReal}" aria-label="Eliminar tarea: ${tarea.texto}" title="Eliminar">✕</button>
      </div>
    `;

    listaTareas.appendChild(li);
  });

  actualizarContadores();
  actualizarFiltros();
  actualizarBotonesAcciones();
}


// ---- ACTUALIZAR CONTADORES ----
function actualizarContadores() {
  const total       = todos.length;
  const completadas = todos.filter(function(t) { return t.completada; }).length;
  const pendientes  = total - completadas;

  const badge = document.querySelector(".lista-badge");
  if (badge) badge.textContent = pendientes + " pendientes";

  const numeros = document.querySelectorAll(".stat-numero");
  if (numeros.length === 3) {
    numeros[0].textContent = pendientes;
    numeros[1].textContent = completadas;
    numeros[2].textContent = total;
  }

  const barra      = document.querySelector(".progreso-barra");
  const textoBarra = document.querySelector(".progreso-texto");
  if (barra) {
    barra.value = completadas;
    barra.max   = total > 0 ? total : 1;
  }
  if (textoBarra) {
    textoBarra.textContent = completadas + " / " + total + " completadas";
  }
}


// ---- ACTUALIZAR BOTONES DE ACCIONES ----
// desactiva "eliminar completadas" si no hay ninguna
// desactiva "desmarcar todas" si no hay ninguna completada
function actualizarBotonesAcciones() {
  const hayCompletadas = todos.some(function(t) { return t.completada; });

  if (btnEliminarCompletadas) {
    btnEliminarCompletadas.disabled = !hayCompletadas;
  }
  if (btnDesmarcarTodas) {
    btnDesmarcarTodas.disabled = !hayCompletadas;
  }
}


// ---- ACTUALIZAR FILTROS ----
function actualizarFiltros() {
  const botonesFiltro = document.querySelectorAll(".filtro-btn");
  botonesFiltro.forEach(function(btn) {
    btn.classList.remove("filtro-btn-activo");
    if (btn.dataset.filtro === filtroActivo) {
      btn.classList.add("filtro-btn-activo");
    }
  });
}


// ---- AVISO ARIA-LIVE ----
function anunciar(mensaje) {
  if (avisoLiveRegion) {
    avisoLiveRegion.textContent = mensaje;
    setTimeout(function() {
      avisoLiveRegion.textContent = "";
    }, 2000);
  }
}


// ---- CONTADOR DE CARACTERES ----
function actualizarContadorChars() {
  const restantes = LIMITE_CARACTERES - inputTarea.value.length;
  if (contadorChars) {
    contadorChars.textContent = restantes + "/" + LIMITE_CARACTERES;
    if (restantes < 10) {
      contadorChars.classList.add("contador-agotado");
    } else {
      contadorChars.classList.remove("contador-agotado");
    }
  }
  if (btnAñadir) {
    btnAñadir.disabled = inputTarea.value.trim() === "";
  }
}


// ---- FLASH VERDE EN EL INPUT ----
function flashInputOk() {
  inputTarea.classList.add("input-ok");
  setTimeout(function() {
    inputTarea.classList.remove("input-ok");
  }, 600);
}


// ---- AÑADIR TAREA ----
function añadirTarea() {
  const texto = inputTarea.value.trim();
  if (texto === "") return;

  const yaExiste = todos.some(function(t) {
    return t.texto.toLowerCase() === texto.toLowerCase();
  });

  if (yaExiste) {
    inputTarea.select();
    return;
  }

  todos.push({ texto: texto, completada: false, hora: obtenerHora() });
  inputTarea.value = "";
  actualizarContadorChars();
  flashInputOk(); // flash verde al añadir
  anunciar("Tarea añadida: " + texto);

  guardarEnStorage();
  renderTodos();
}


// ---- MARCAR TAREA COMO COMPLETADA ----
function marcarTarea(indice) {
  todos[indice].completada = !todos[indice].completada;
  const estado = todos[indice].completada ? "completada" : "pendiente";
  anunciar("Tarea marcada como " + estado + ": " + todos[indice].texto);

  guardarEnStorage();
  renderTodos();
}


// ---- DESMARCAR TODAS ----
function desmarcarTodas() {
  todos.forEach(function(t) { t.completada = false; });
  anunciar("Todas las tareas desmarcadas");

  guardarEnStorage();
  renderTodos();
}


// ---- ELIMINAR TAREA INDIVIDUAL ----
function eliminarTarea(indice) {
  const textoEliminada = todos[indice].texto;

  const btnX = listaTareas.querySelector(`[data-indice="${indice}"]`);
  if (btnX) {
    const li = btnX.closest(".tarea");
    if (li) {
      li.classList.add("tarea-saliendo");
      setTimeout(function() {
        todos.splice(indice, 1);
        anunciar("Tarea eliminada: " + textoEliminada);
        guardarEnStorage();
        renderTodos();
      }, 300);
      return;
    }
  }

  todos.splice(indice, 1);
  anunciar("Tarea eliminada: " + textoEliminada);
  guardarEnStorage();
  renderTodos();
}


// ---- ELIMINAR TAREAS COMPLETADAS ----
function eliminarCompletadas() {
  const cantidad = todos.filter(function(t) { return t.completada; }).length;
  if (cantidad === 0) return;

  todos = todos.filter(function(t) { return !t.completada; });
  anunciar(cantidad + " tareas completadas eliminadas");

  guardarEnStorage();
  renderTodos();
}


// ---- ELIMINAR TODAS LAS TAREAS ----
function eliminarTodas() {
  if (todos.length === 0) return;

  todos = [];
  anunciar("Todas las tareas eliminadas");

  guardarEnStorage();
  renderTodos();
}


// ---- EVENT LISTENERS ----
formulario.addEventListener("submit", function(evento) {
  evento.preventDefault();
  añadirTarea();
});

inputTarea.addEventListener("keydown", function(evento) {
  if (evento.key === "Enter") añadirTarea();
  if (evento.key === "Escape") {
    inputTarea.value = "";
    actualizarContadorChars();
  }
});

inputTarea.addEventListener("input", function() {
  actualizarContadorChars();
});

inputTarea.setAttribute("maxlength", LIMITE_CARACTERES);

listaTareas.addEventListener("change", function(evento) {
  if (evento.target.type !== "checkbox") return;
  const indice = parseInt(evento.target.id.replace("tarea-", ""));
  marcarTarea(indice);
});

listaTareas.addEventListener("click", function(evento) {
  const btnEliminar = evento.target.closest(".btn-eliminar-tarea");
  if (btnEliminar) {
    const indice = parseInt(btnEliminar.dataset.indice);
    eliminarTarea(indice);
  }
});

if (filtros) {
  filtros.addEventListener("click", function(evento) {
    const btn = evento.target.closest(".filtro-btn");
    if (!btn) return;
    filtroActivo = btn.dataset.filtro;
    guardarEnStorage();
    renderTodos();
  });
}

btnEliminarCompletadas.addEventListener("click", function() {
  eliminarCompletadas();
});

btnEliminarTodas.addEventListener("click", function() {
  eliminarTodas();
});

if (btnModo) {
  btnModo.addEventListener("click", function() {
    toggleModo();
  });
}

if (btnDesmarcarTodas) {
  btnDesmarcarTodas.addEventListener("click", function() {
    desmarcarTodas();
  });
}


// ---- INCIO ----
cargarDeStorage();
aplicarModo();
renderTodos();
inputTarea.focus();
actualizarContadorChars();