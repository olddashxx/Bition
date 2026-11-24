// [SCRIPT PRINCIPAL BITION S.R.L.] SPA 6 pestañas, Catálogo JSON, Cotizador WhatsApp y Validación DOM
const WHATSAPP_BITION = '59177766637'; // Número oficial de WhatsApp comercial de Bition S.R.L.

// [1. PWA SERVICE WORKER]
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('sw.js')
      .then((reg) => console.log('[PWA Bition] Service Worker registrado:', reg.scope))
      .catch((err) => console.warn('[PWA Bition] Registro SW omitido:', err));
  });
}

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  $('#btnInstalarPWA, #btnInstalarPWADock').prop('hidden', false).fadeIn();
});

// [ANTI-XSS DOMPURIFY]
function sanitizarHTML(contenido) {
  if (typeof DOMPurify !== 'undefined' && DOMPurify.sanitize) {
    return DOMPurify.sanitize(contenido);
  }
  const div = document.createElement('div');
  div.textContent = contenido || '';
  return div.innerHTML;
}

// [RESPALDO LOCAL DEL CATÁLOGO] Garantiza funcionamiento completo incluso en file://
const SOLUCIONES_RESPALDO = [
  {
    id: 1,
    codigo: 'BT-DAT',
    nombre: 'Datamark — Licencia Mensual (Gaceta Oficial)',
    categoria: 'datamark',
    categoriaLabel: 'Datamark',
    presentacion: 'Suscripción Mensual • Hasta 3 usuarios • Gaceta Oficial',
    precio: 1200,
    unidad: 'BOB / mes',
    etiqueta: 'Base Gaceta Oficial',
    descripcion: 'Acceso multiusuario (hasta 3 abogados o agentes) con migración mensual de la Gaceta Oficial de Bolivia y búsquedas ilimitadas de anterioridades antes de acudir al SENAPI.',
    caracteristicas: [
      'Acceso para hasta 3 abogados o agentes de propiedad intelectual',
      'Migración y clasificación mensual por número de publicación oficial',
      'Búsquedas ilimitadas de anterioridades antes de pagar tasas al SENAPI',
      'Filtros avanzados por denominación, clase Niza, titular y gaceta'
    ],
    palabrasClave: 'datamark gaceta oficial bolivia anterioridades senapi licencia mensual multiusuario'
  },
  {
    id: 2,
    codigo: 'BT-IAV',
    nombre: 'Módulo Datamark + IA — Reconocimiento Figurativo',
    categoria: 'ia-figurativa',
    categoriaLabel: 'Datamark + IA Visual',
    presentacion: 'Módulo de Inteligencia Artificial Visual',
    precio: 700,
    unidad: 'BOB / mes',
    etiqueta: 'IA Visual • Logotipos',
    descripcion: 'Motor con Inteligencia Artificial que analiza formas, trazos geométricos y composiciones visuales de logotipos, isotipos y marcas mixtas frente al repositorio gráfico de Bolivia.',
    caracteristicas: [
      'Análisis visual de logotipos, isotipos y marcas mixtas',
      'Detección temprana de similitudes gráficas antes del trámite formal',
      'Comparación directa contra marcas publicadas en la Gaceta Oficial',
      'Reduce riesgos de observación o rechazo por similitud figurativa'
    ],
    palabrasClave: 'ia inteligencia artificial figurativa logotipo isotipo visual marca mixta'
  },
  {
    id: 3,
    codigo: 'BT-MIX',
    nombre: 'Estudio Integral de Anterioridades (IA Mixta + Visual)',
    categoria: 'datamark',
    categoriaLabel: 'Datamark',
    presentacion: 'Informe Técnico Único de Viabilidad',
    precio: 450,
    unidad: 'BOB / reporte',
    etiqueta: 'Fonética • Silábica • Visual',
    descripcion: 'Informe técnico único combinando búsqueda fonética, silábica, semántica, natural y figurativa sobre toda la base histórica antes de iniciar trámite en el SENAPI.',
    caracteristicas: [
      'Detección fonética y silábica para evitar confusión auditiva',
      'Búsqueda semántica, natural y comparación figurativa de logotipo',
      'Informe técnico estructurado listo para presentar al cliente o titular',
      'Ideal para estudios puntuales sin suscripción mensual'
    ],
    palabrasClave: 'estudio integral anterioridades busqueda mixta fonetica silabica semantica visual reporte'
  },
  {
    id: 4,
    codigo: 'BT-IPM',
    nombre: 'IPMatic — ERP de Propiedad Intelectual (SENAPI)',
    categoria: 'ipmatic',
    categoriaLabel: 'IPMatic',
    presentacion: 'Plataforma ERP Mensual • Ciclo Completo SENAPI',
    precio: 1750,
    unidad: 'BOB / mes',
    etiqueta: 'ERP Propiedad Intelectual',
    descripcion: 'Gestión integral del ciclo de vida de marcas ante el SENAPI: formularios, publicación en Gaceta, registro, oposiciones (demandante/demandado) y denegatorias.',
    caracteristicas: [
      'Control del ciclo completo hasta la obtención del título de registro',
      'Módulos para actuar como demandante o demandado en oposiciones',
      'Seguimiento de denegatorias, recursos y cambios de estado procesal',
      'Panel centralizado para apoderados legales, titulares y solicitantes'
    ],
    palabrasClave: 'ipmatic erp senapi oposiciones demandante demandado denegatorias registro'
  },
  {
    id: 5,
    codigo: 'BT-PLZ',
    nombre: 'Módulo de Alertas Procesales y Plazos SENAPI',
    categoria: 'ipmatic',
    categoriaLabel: 'IPMatic',
    presentacion: 'Módulo Complementario de Control Procesal',
    precio: 490,
    unidad: 'BOB / mes',
    etiqueta: 'Cero Vencimientos',
    descripcion: 'Monitoreo automatizado de términos procesales, vencimientos, presentación de pruebas a oposiciones, contestaciones y descargos ante el SENAPI.',
    caracteristicas: [
      'Alertas preventivas automatizadas para plazos de oposición y contestación',
      'Trazabilidad de cada cambio de estado procesal',
      'Recordatorios críticos para presentación de pruebas y descargos',
      'Prevención de caducidades o pérdida de términos legales'
    ],
    palabrasClave: 'alertas procesales plazos oposiciones senapi vencimientos pruebas descargos'
  },
  {
    id: 6,
    codigo: 'BT-OCR',
    nombre: 'Módulo Archivo Digital OCR de Expedientes',
    categoria: 'ipmatic',
    categoriaLabel: 'IPMatic',
    presentacion: 'Módulo Complementario de Digitalización',
    precio: 420,
    unidad: 'BOB / mes',
    etiqueta: 'Expedientes Escaneados',
    descripcion: 'Digitalización, indexación OCR y respaldo estructurado de expedientes escaneados vinculados directamente por caso y titular.',
    caracteristicas: [
      'Carga y respaldo seguro de expedientes escaneados por caso',
      'Indexación automática OCR por titular, número de solicitud y clase',
      'Acceso inmediato para todo el equipo legal desde la nube',
      'Elimina búsqueda física en archivos de papel'
    ],
    palabrasClave: 'ocr archivo digital expedientes escaneados respaldo documentos'
  },
  {
    id: 7,
    codigo: 'BT-ECO',
    nombre: 'Suite Corporativa Completa (Datamark + IA + IPMatic)',
    categoria: 'empresarial',
    categoriaLabel: 'Suite Empresarial',
    presentacion: 'Suscripción Mensual Integral • Hasta 5 usuarios',
    precio: 2800,
    unidad: 'BOB / mes',
    etiqueta: 'Más Solicitado • Suite',
    descripcion: 'Ecosistema integral para estudios jurídicos y departamentos legales (hasta 5 usuarios), con soporte prioritario y migración mensual de Gaceta incluida.',
    caracteristicas: [
      'Incluye Datamark Gaceta Oficial + Búsqueda Mixta y Figurativa IA',
      'Incluye ERP IPMatic, alertas procesales y archivo digital OCR',
      'Hasta 5 usuarios simultáneos con soporte técnico prioritario',
      'Cobertura completa del ciclo de vida de la marca en Bolivia'
    ],
    palabrasClave: 'suite corporativa completa datamark ia ipmatic empresarial estudio juridico 5 usuarios'
  },
  {
    id: 8,
    codigo: 'BT-ANU',
    nombre: 'Licencia Anual Estudio Jurídico (Todo Incluido)',
    categoria: 'empresarial',
    categoriaLabel: 'Suite Empresarial',
    presentacion: 'Licencia Anual Corporativa • 12 Meses',
    precio: 28000,
    unidad: 'BOB / año',
    etiqueta: '2 Meses Bonificados',
    descripcion: 'Cobertura anual completa del ecosistema Bition con 2 meses bonificados, implementación asistida, migración de cartera y capacitación al equipo legal.',
    caracteristicas: [
      '12 meses de acceso total con 2 meses bonificados sobre tarifa mensual',
      'Implementación asistida y capacitación personalizada al equipo legal',
      'Migración mensual continua de la Gaceta Oficial de Bolivia',
      'Soporte técnico prioritario y acompañamiento continuo'
    ],
    palabrasClave: 'licencia anual estudio juridico todo incluido corporativo 12 meses implementacion'
  }
];

$(document).ready(function () {
  let catalogoSoluciones = [...SOLUCIONES_RESPALDO];
  let categoriaActual = 'todos';
  let carritoCotizacion = [];

  // [2. MODO OSCURO NATIVO (classList.toggle + localStorage)]
  if (localStorage.getItem('bition_tema') === 'oscuro') {
    document.body.classList.add('dark-mode');
  }

  function alternarModoOscuro() {
    document.body.classList.toggle('dark-mode');
    const estaOscuro = document.body.classList.contains('dark-mode');
    localStorage.setItem('bition_tema', estaOscuro ? 'oscuro' : 'claro');
  }

  const themeBtn = document.getElementById('themeBtn');
  const themeBtnDock = document.getElementById('themeBtnDock');
  if (themeBtn) themeBtn.addEventListener('click', alternarModoOscuro);
  if (themeBtnDock) themeBtnDock.addEventListener('click', alternarModoOscuro);

  // [3. NAVEGACIÓN SPA POR PESTAÑAS + MENÚ HAMBURGUESA]
  function cambiarTab(tabId) {
    if (!tabId) return;
    $('.panel-tab').removeClass('active').hide();
    $('#' + tabId).addClass('active').fadeIn(200);

    $('.dock-acciones__btn').removeClass('active').attr('aria-selected', 'false');
    $(`.dock-acciones__btn[data-tab="${tabId}"]`).addClass('active').attr('aria-selected', 'true');

    $('#navMenu').slideUp(180);
    $('#hamburgerBtn').attr('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  $(document).on('click', '.dock-acciones__btn, .btn-go-tab, .nav-menu-tab', function () {
    const tabId = $(this).data('tab');
    if (tabId) cambiarTab(tabId);
  });

  $('#hamburgerBtn').on('click', function () {
    const $menu = $('#navMenu');
    $menu.slideToggle(240, function () {
      $('#hamburgerBtn').attr('aria-expanded', $menu.is(':visible') ? 'true' : 'false');
    });
  });

  function mostrarToast(mensaje) {
    $('#toastMsg').text(mensaje);
    $('#toastAlert').stop(true, true).slideDown(220).delay(2600).fadeOut(360);
  }

  // [4. SOLUCIONES: FILTRO NATIVO (querySelectorAll + dataset) + PANEL TEMÁTICO + ACORDEONES]
  const botonesSoluciones = document.querySelectorAll('.btn-filtro-sol');
  botonesSoluciones.forEach((btn) => {
    btn.addEventListener('click', function () {
      const cat = btn.dataset.cat;
      botonesSoluciones.forEach((b) => {
        b.classList.remove('btn-primario');
        b.classList.add('btn-secundario');
      });
      btn.classList.remove('btn-secundario');
      btn.classList.add('btn-primario');

      document.querySelectorAll('.tarjeta-modulo').forEach((card) => {
        card.style.display = (cat === 'todos' || card.dataset.categoria === cat) ? 'block' : 'none';
      });
    });
  });

  const infoSistemas = {
    datamark: {
      clase: 'tema-datamark',
      titulo: 'Datamark — Vigilancia y Anterioridades',
      desc: 'Plataforma de inteligencia de datos para obtener un diagnóstico inmediato sobre la viabilidad de registrar una marca antes de acudir al SENAPI.'
    },
    ia: {
      clase: 'tema-ia',
      titulo: 'Datamark + IA — Búsqueda Mixta y Figurativa',
      desc: 'Motor con Inteligencia Artificial para análisis fonético, silábico, semántico y comparación visual de logotipos contra la Gaceta Oficial.'
    },
    ipmatic: {
      clase: 'tema-ipmatic',
      titulo: 'IPMatic — ERP de Propiedad Intelectual',
      desc: 'Control integral del ciclo ante el SENAPI: formularios, oposiciones (demandante/demandado), denegatorias, plazos y archivo OCR.'
    }
  };

  $('.btn-tema-sistema').on('click', function () {
    const cfg = infoSistemas[$(this).data('tema')];
    if (!cfg) return;
    $('#panelTematico').removeClass('tema-datamark tema-ia tema-ipmatic').addClass(cfg.clase);
    $('#tituloTema').text(cfg.titulo);
    $('#descTema').text(cfg.desc);
  });

  $('.accordion-btn').on('click', function () {
    $(this).next('.accordion-panel').slideToggle('fast');
  });

  // [5. CATÁLOGO DINÁMICO JSON + BUSCADOR EN TIEMPO REAL + FILTROS querySelectorAll]
  function poblarSelectorRapido(lista) {
    const $sel = $('#selectSolucionRapida');
    if (!$sel.length) return;
    $sel.find('option:not(:first)').remove();
    lista.forEach((sol) => {
      $sel.append(
        $('<option>')
          .val(sol.codigo)
          .text(`${sol.nombre} — ${sol.precio} ${sol.unidad}`)
          .attr('data-nombre', sol.nombre)
          .attr('data-precio', sol.precio)
          .attr('data-unidad', sol.unidad)
      );
    });
  }

  function renderizarCatalogo(lista) {
    const gridEl = document.getElementById('catalogoSoluciones');
    if (!gridEl) return;

    if (!lista.length) {
      gridEl.innerHTML = sanitizarHTML('<div class="carrito-vacio" style="grid-column: 1 / -1;">No se encontraron soluciones o módulos con ese criterio.</div>');
      return;
    }

    const html = lista.map((sol) => {
      const listaCar = sol.caracteristicas && sol.caracteristicas.length
        ? `<ul>${sol.caracteristicas.map((c) => `<li>${c}</li>`).join('')}</ul>`
        : '';

      return `
        <article class="solucion-card">
          <div><span class="badge-etiqueta">${sol.categoriaLabel} • ${sol.etiqueta}</span></div>
          <h3 class="solucion-card__titulo">${sol.nombre}</h3>
          <p class="solucion-card__sub">${sol.presentacion}</p>
          <p class="solucion-card__desc">${sol.descripcion}</p>
          <div class="solucion-card__detalles">${listaCar}</div>
          <div class="solucion-card__footer">
            <div>
              <span class="solucion-card__precio-val">${sol.precio} BOB</span>
              <span class="solucion-card__unidad">${sol.unidad}</span>
            </div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap;">
              <button type="button" class="btn-secundario btn-ver-detalles">Ver detalle</button>
              <button type="button" class="btn-primario btn-agregar-cotizar"
                data-codigo="${sol.codigo}"
                data-nombre="${sol.nombre}"
                data-precio="${sol.precio}"
                data-unidad="${sol.unidad}">
                + Cotizar
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    gridEl.innerHTML = sanitizarHTML(html);
  }

  function aplicarFiltrosCatalogo() {
    const query = ($('#buscadorSoluciones').val() || '').trim().toLowerCase();
    const filtrados = catalogoSoluciones.filter((sol) => {
      const okCat = categoriaActual === 'todos' || sol.categoria === categoriaActual;
      const texto = `${sol.nombre} ${sol.categoriaLabel} ${sol.descripcion} ${sol.palabrasClave} ${sol.precio}`.toLowerCase();
      const okQuery = !query || texto.includes(query);
      return okCat && okQuery;
    });
    renderizarCatalogo(filtrados);
  }

  const botonesFiltroCat = document.querySelectorAll('.btn-filtro-cat');
  botonesFiltroCat.forEach((boton) => {
    boton.addEventListener('click', function () {
      categoriaActual = boton.dataset.cat;
      botonesFiltroCat.forEach((b) => {
        b.classList.remove('btn-primario');
        b.classList.add('btn-secundario');
      });
      boton.classList.remove('btn-secundario');
      boton.classList.add('btn-primario');
      aplicarFiltrosCatalogo();
    });
  });

  $('#buscadorSoluciones').on('input', aplicarFiltrosCatalogo);

  $(document).on('click', '.btn-ver-detalles', function () {
    const $btn = $(this);
    const $detalles = $btn.closest('.solucion-card').find('.solucion-card__detalles');
    $detalles.slideToggle(200, function () {
      $btn.text($detalles.is(':visible') ? 'Ocultar' : 'Ver detalle');
    });
  });

  if (window.location.protocol !== 'file:') {
    fetch('data/soluciones.json')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (data && Array.isArray(data.soluciones) && data.soluciones.length) {
          catalogoSoluciones = data.soluciones;
        }
        poblarSelectorRapido(catalogoSoluciones);
        aplicarFiltrosCatalogo();
      })
      .catch(() => {
        poblarSelectorRapido(catalogoSoluciones);
        aplicarFiltrosCatalogo();
      });
  } else {
    poblarSelectorRapido(catalogoSoluciones);
    aplicarFiltrosCatalogo();
  }

  // [6. REGLAS DE VALIDACIÓN CON BLACKLIST Y MENSAJES VISIBLES (SENAPI, COTIZAR Y CONTACTO)]
  const BLACKLIST_PALABRAS = [
    'asdasd', 'asd', 'adasd', 'dasd', 'qwerty', 'qwe', 'asdf', 'sdf', 'dsg', 'sdg',
    'zxc', 'fgh', 'ghj', 'hjk', 'jkl', 'test', 'prueba', 'fake', 'xxx', 'aaa', 'zzz',
    'null', 'undefined', 'admin', 'usuario', 'ejemplo', 'lorem', 'ipsum', 'ninguno', 'nada', 'nose'
  ];

  const SIGLAS_PERMITIDAS = ['srl', 's.r.l.', 'sa', 's.a.', 'senapi', 'ocr', 'erp', 'pi', 'ia'];

  function esTextoReal(valor, minPalabras) {
    const limpio = (valor || '').trim().toLowerCase();
    if (!limpio) return false;
    if (BLACKLIST_PALABRAS.some((b) => limpio.includes(b))) return false;
    if (/(.)\1\1/i.test(limpio)) return false;
    if (/(.{2,4})\1\1/i.test(limpio.replace(/\s+/g, ''))) return false;
    if (/[bcdfghjklmnpqrstvwxyzñ]{4,}/i.test(limpio)) return false;

    const palabras = limpio.split(/\s+/).filter(Boolean);
    if (palabras.length < minPalabras) return false;

    return palabras.every((p) => {
      const soloLetras = p.replace(/[^a-záéíóúüñ]/gi, '');
      if (soloLetras.length < 3 || SIGLAS_PERMITIDAS.includes(p)) return true;
      const vocales = (soloLetras.match(/[aeiouáéíóúü]/gi) || []).length;
      return vocales >= 1 && (vocales / soloLetras.length) >= 0.22;
    });
  }

  const reglas = {
    '#titularNombre': {
      err: '#errTitularNombre',
      validar: (v) => v.trim().length >= 4 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.&'-]+$/.test(v.trim()) && esTextoReal(v, 1)
    },
    '#inputExpediente': {
      err: '#errInputExpediente',
      validar: (v) => v.trim().length >= 3 && esTextoReal(v, 1)
    },
    '#cotizarEmpresa': {
      err: '#errCotizarEmpresa',
      validar: (v) => v.trim().length >= 4 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.&'-]+$/.test(v.trim()) && esTextoReal(v, 1)
    },
    '#cotizarMeses': {
      err: '#errCotizarMeses',
      validar: (v) => {
        const n = Number(v);
        return Number.isInteger(n) && n >= 1 && n <= 36;
      }
    },
    '#nombre': {
      err: '#errNombre',
      validar: (v) => v.trim().length >= 5 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.&'-]+$/.test(v.trim()) && esTextoReal(v, 2)
    },
    '#telefono': {
      err: '#errTelefono',
      validar: (v) => /^[67][0-9]{7}$/.test(v.trim())
    },
    '#correo': {
      err: '#errCorreo',
      validar: (v) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v.trim())
    },
    '#mensaje': {
      err: '#errMensaje',
      validar: (v) => v.trim().length >= 8 && esTextoReal(v, 2)
    }
  };

  function validarCampo(sel) {
    const regla = reglas[sel];
    const $campo = $(sel);
    if (!regla || !$campo.length) return true;
    const val = $campo.val() || '';
    const ok = regla.validar(val);
    const $err = $(regla.err);

    if (ok) {
      $campo.removeClass('input-invalido').addClass('input-valido');
      $err.removeClass('visible').stop(true, true).hide();
    } else {
      $campo.removeClass('input-valido').addClass('input-invalido');
      $err.addClass('visible').stop(true, true).show();
    }
    return ok;
  }

  Object.keys(reglas).forEach((sel) => {
    $(sel).on('blur', () => validarCampo(sel)).on('input', function () {
      if ($(this).hasClass('input-invalido') || $(this).hasClass('input-valido')) validarCampo(sel);
    });
  });

  // [7. GESTIÓN SENAPI: TRÁMITES Y COLA DE VIGILANCIA]
  const formTramite = document.getElementById('formTramite');
  const listaTramites = document.getElementById('listaTramites');
  if (formTramite && listaTramites) {
    formTramite.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validarCampo('#titularNombre')) return;
      const titular = document.getElementById('titularNombre').value.trim();
      const etapa = document.getElementById('etapaSelect').value;

      const li = document.createElement('li');
      const strong = document.createElement('strong');
      strong.textContent = titular + ': ';
      li.appendChild(strong);
      li.appendChild(document.createTextNode(etapa));
      listaTramites.prepend(li);

      formTramite.reset();
      $('#titularNombre').removeClass('input-valido input-invalido');
      $('#errTitularNombre').removeClass('visible').hide();
      mostrarToast('Trámite registrado en IPMatic.');
    });
  }

  const btnVigilar = document.getElementById('btnVigilar');
  const listaExpedientes = document.getElementById('listaExpedientes');
  if (btnVigilar && listaExpedientes) {
    btnVigilar.addEventListener('click', function () {
      if (!validarCampo('#inputExpediente')) return;
      const inp = document.getElementById('inputExpediente');
      const texto = inp.value.trim();

      const item = document.createElement('div');
      item.className = 'cola-item';
      const span = document.createElement('span');
      span.textContent = texto;
      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.className = 'btn-quitar';
      btnDel.textContent = 'Quitar';
      btnDel.addEventListener('click', () => item.remove());

      item.appendChild(span);
      item.appendChild(btnDel);
      listaExpedientes.prepend(item);

      inp.value = '';
      $('#inputExpediente').removeClass('input-valido input-invalido');
      $('#errInputExpediente').removeClass('visible').hide();
      mostrarToast('Expediente añadido a vigilancia de plazos.');
    });
  }

  // [8. CARRITO COTIZADOR (innerHTML + addEventListener + WhatsApp)]
  function actualizarResumenCotizacion() {
    const meses = Math.max(1, parseInt($('#cotizarMeses').val(), 10) || 1);
    let totalMensual = 0;
    let totalItems = 0;

    carritoCotizacion.forEach((item) => {
      totalMensual += item.precio * item.cantidad;
      totalItems += item.cantidad;
    });

    const totalFinal = totalMensual * meses;
    $('#totalCotizacion').text(totalFinal);

    const detalleEl = document.getElementById('resumenCarritoDetalle');
    if (detalleEl) {
      if (!carritoCotizacion.length) {
        detalleEl.innerHTML = sanitizarHTML('<span>Sin soluciones seleccionadas aún.</span>');
      } else {
        const itemsTxt = carritoCotizacion
          .map((i) => `<li>${i.cantidad}x ${i.nombre} (${i.precio * i.cantidad} BOB)</li>`)
          .join('');
        detalleEl.innerHTML = sanitizarHTML(
          `<div><strong>Duración:</strong> ${meses} mes(es)</div>` +
          `<ul style="margin: 4px 0 0 18px;">${itemsTxt}</ul>`
        );
      }
    }

    const $badge = $('#badgeCotizarCount');
    if (totalItems > 0) {
      $badge.text(totalItems).prop('hidden', false);
    } else {
      $badge.prop('hidden', true);
    }
  }

  function renderizarCarrito() {
    const listaEl = document.getElementById('carritoLista');
    if (!listaEl) return;

    if (!carritoCotizacion.length) {
      listaEl.innerHTML = sanitizarHTML('<p class="carrito-vacio">Tu cotización está vacía. Agrega soluciones desde el Catálogo o el selector superior.</p>');
      actualizarResumenCotizacion();
      return;
    }

    const html = carritoCotizacion.map((item, idx) => `
      <div class="carrito-item">
        <div>
          <strong style="font-size: 14px; display: block;">${item.nombre}</strong>
          <small style="color: var(--text-muted);">${item.precio} ${item.unidad}</small>
        </div>
        <div class="carrito-item__controles">
          <button type="button" class="btn-qty btn-qty-menos" data-idx="${idx}" aria-label="Disminuir">-</button>
          <span style="min-width: 22px; text-align: center; font-weight: 700;">${item.cantidad}</span>
          <button type="button" class="btn-qty btn-qty-mas" data-idx="${idx}" aria-label="Aumentar">+</button>
          <button type="button" class="btn-quitar" data-idx="${idx}" aria-label="Quitar">✕</button>
        </div>
      </div>
    `).join('');

    listaEl.innerHTML = sanitizarHTML(html);
    actualizarResumenCotizacion();
  }

  function agregarSolucion(codigo, nombre, precio, unidad) {
    const existente = carritoCotizacion.find((i) => i.codigo === codigo);
    if (existente) {
      existente.cantidad += 1;
    } else {
      carritoCotizacion.push({
        codigo,
        nombre,
        precio: Number(precio) || 0,
        unidad: unidad || 'BOB / mes',
        cantidad: 1
      });
    }
    $('#selectSolucionRapida').removeClass('input-invalido');
    $('#errCotizarItems').removeClass('visible').hide();
    renderizarCarrito();
  }

  $(document).on('click', '.btn-agregar-cotizar', function () {
    const $btn = $(this);
    agregarSolucion($btn.data('codigo'), $btn.data('nombre'), $btn.data('precio'), $btn.data('unidad'));
    mostrarToast(`"${$btn.data('nombre')}" agregado a tu cotización.`);
  });

  $('#btnAgregarRapido').on('click', function () {
    const sel = document.getElementById('selectSolucionRapida');
    if (!sel || !sel.value) {
      mostrarToast('Elige primero una solución de la lista.');
      return;
    }
    const opt = sel.options[sel.selectedIndex];
    agregarSolucion(opt.value, opt.dataset.nombre, opt.dataset.precio, opt.dataset.unidad);
    mostrarToast(`"${opt.dataset.nombre}" agregado a tu cotización.`);
  });

  $(document).on('click', '.btn-qty-mas', function () {
    const idx = Number($(this).data('idx'));
    if (carritoCotizacion[idx]) {
      carritoCotizacion[idx].cantidad += 1;
      renderizarCarrito();
    }
  });

  $(document).on('click', '.btn-qty-menos', function () {
    const idx = Number($(this).data('idx'));
    if (carritoCotizacion[idx]) {
      carritoCotizacion[idx].cantidad -= 1;
      if (carritoCotizacion[idx].cantidad <= 0) carritoCotizacion.splice(idx, 1);
      renderizarCarrito();
    }
  });

  $(document).on('click', '.btn-quitar', function () {
    const idx = Number($(this).data('idx'));
    carritoCotizacion.splice(idx, 1);
    renderizarCarrito();
  });

  $('#cotizarMeses').on('input change', actualizarResumenCotizacion);

  const btnWhatsAppCotizacion = document.getElementById('btnWhatsAppCotizacion');
  if (btnWhatsAppCotizacion) {
    btnWhatsAppCotizacion.addEventListener('click', function () {
      if (!carritoCotizacion.length) {
        const sel = document.getElementById('selectSolucionRapida');
        if (sel && sel.value) {
          const opt = sel.options[sel.selectedIndex];
          agregarSolucion(opt.value, opt.dataset.nombre, opt.dataset.precio, opt.dataset.unidad);
        } else {
          $('#selectSolucionRapida').addClass('input-invalido');
          $('#errCotizarItems').addClass('visible').show();
          mostrarToast('Agrega al menos una solución para generar tu cotización.');
          return;
        }
      }

      const okEmp = validarCampo('#cotizarEmpresa');
      const okMes = validarCampo('#cotizarMeses');
      if (!(okEmp && okMes)) {
        mostrarToast('Revisa los campos marcados en rojo antes de enviar.');
        return;
      }

      const empresa = ($('#cotizarEmpresa').val() || '').trim();
      const meses = Math.max(1, parseInt($('#cotizarMeses').val(), 10) || 1);
      let totalMensual = 0;
      const lineas = carritoCotizacion.map((item) => {
        const sub = item.precio * item.cantidad;
        totalMensual += sub;
        return `- ${item.cantidad}x ${item.nombre} (${sub} BOB - ${item.unidad})`;
      });

      const totalFinal = totalMensual * meses;
      const mensaje = [
        'Hola *Bition S.R.L.*,',
        'Quisiera solicitar una cotización oficial para:',
        '',
        ...lineas,
        '',
        `*Duración estimada:* ${meses} mes(es)`,
        `*Total estimado:* ${totalFinal} BOB`,
        `*Empresa / Estudio:* ${empresa}`
      ].join('\n');

      window.open(
        `https://api.whatsapp.com/send?phone=${WHATSAPP_BITION}&text=${encodeURIComponent(mensaje)}`,
        '_blank',
        'noopener,noreferrer'
      );
    });
  }

  renderizarCarrito();

  // [9. CONTACTO CON PREVENTDEFAULT + COLA OFFLINE + ESTADO DE RED + PWA INSTALL]
  const contactoForm = document.getElementById('contactoForm');
  if (contactoForm) {
    contactoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const okN = validarCampo('#nombre');
      const okT = validarCampo('#telefono');
      const okC = validarCampo('#correo');
      const okM = validarCampo('#mensaje');
      if (!(okN && okT && okC && okM)) return;

      const nombre = $('#nombre').val().trim();
      const telefono = $('#telefono').val().trim();
      const correo = $('#correo').val().trim();
      const mensaje = $('#mensaje').val().trim();

      if (navigator.onLine) {
        const textoWa = [
          'Hola *Bition S.R.L.*,',
          `Soy *${nombre}* (Cel: ${telefono} | Correo: ${correo}).`,
          '',
          mensaje
        ].join('\n');
        window.open(
          `https://api.whatsapp.com/send?phone=${WHATSAPP_BITION}&text=${encodeURIComponent(textoWa)}`,
          '_blank',
          'noopener,noreferrer'
        );
        $('#successAlert').text('✅ Solicitud preparada y abierta en WhatsApp.').stop(true, true).slideDown().delay(3500).slideUp();
      } else {
        const cola = JSON.parse(localStorage.getItem('bition_cola_offline') || '[]');
        cola.push({ nombre, telefono, correo, mensaje, fecha: new Date().toISOString() });
        localStorage.setItem('bition_cola_offline', JSON.stringify(cola));
        $('#successAlert').text('🟠 Sin conexión: tu solicitud se guardó localmente.').stop(true, true).slideDown().delay(4000).slideUp();
      }

      contactoForm.reset();
      ['#nombre', '#telefono', '#correo', '#mensaje'].forEach((sel) => {
        $(sel).removeClass('input-valido input-invalido');
        $(reglas[sel].err).removeClass('visible').hide();
      });
    });
  }

  function actualizarEstadoRed() {
    if (navigator.onLine) {
      $('#estadoRed, #estadoRedDock').text('🟢 En Línea').css({ background: '#dcfce7', color: '#065f46' });
    } else {
      $('#estadoRed, #estadoRedDock').text('🟠 Sin Conexión').css({ background: '#ffedd5', color: '#9a3412' });
    }
  }

  $(window).on('online offline', actualizarEstadoRed);
  actualizarEstadoRed();

  $('#btnInstalarPWA, #btnInstalarPWADock').on('click', async function () {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    $('#btnInstalarPWA, #btnInstalarPWADock').prop('hidden', true).fadeOut();
  });
});
