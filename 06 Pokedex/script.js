document.addEventListener('DOMContentLoaded', function () {
  //#region OBSERVADOR DE IMAGENES TASK
  const imgOptions = {};
  const imgObserver = new IntersectionObserver((entries, imgObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      let dataImage = img.getAttribute('data-images');
      img.src = dataImage;
      imgObserver.unobserve(img);
    });
  }, imgOptions);
  //#endregion

  //#region CONSUMO DE API CON FETCH
  const fetchpokemons = async (endpoint) => {
    let data;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      data = await response.json();
    }
    catch (error) {
      console.log(error);
    }
    return data.pokemon_species;
  };
  //#endregion

  //#region ORDENAR NUMEROS DE POKEMONS
  function orderNumber(str) {

    let mySubString = str.substring(
      str.lastIndexOf('s/') + 2, str.lastIndexOf('/')
    );
    return mySubString;
  }
  //#endregion

  //#region AGREGANDO POKEMONS AL HTML
  async function getPokemons(numero, toggle) {

    let endpoint = `https://pokeapi.co/api/v2/generation/${ numero }/`;
    let container = document.getElementById('container');

    container.innerHTML = '';

    let pokemons = [];

    pokemons = await fetchpokemons(endpoint);

    for (let j = 0; j < pokemons.length; j++) {
      pokemons[j].nr = orderNumber(pokemons[j].url);
    }
    pokemons.sort((a, b) => a.nr - b.nr);

    pokemons.forEach((item) => {

      let numero3decimales = orderNumber(item.url);

      if (numero3decimales < 10) {
        numero3decimales = '0' + numero3decimales;
      }
      if (numero3decimales < 100) {
        numero3decimales = '0' + numero3decimales;
      }

      let divItem = document.createElement('li');
      divItem.classList.add('item');

      let img = new Image();
      const toggleUrl = toggle ? 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' : 'https://www.serebii.net/pokemongo/pokemon/';

      img.src = 'pokemon-pokeball.gif';
      const urlImage = `${ toggleUrl }${ numero3decimales }.png`;
      img.setAttribute('data-images', urlImage);
      img.setAttribute('class', 'pokeimage');
      img.setAttribute('alt', item.name);

      divItem.innerHTML = `<div> ${ orderNumber(item.url) }-${ item.name } </div>`;
      divItem.appendChild(img);
      container.appendChild(divItem);
      imgObserver.observe(img);
    });
    console.log(pokemons);
  }
  //#endregion

  //#region AGREGAR GENERACIONES
  let numero = 1;
  getPokemons(numero);
  let toggle = false;

  btnicono.addEventListener('click', function () {
    toggle = !toggle;
    getPokemons(numero, toggle);
  });

  let geners = [
    'generation-1',
    'generation-2',
    'generation-3',
    'generation-4',
    'generation-5',
    'generation-6',
    'generation-7',
  ];

  let filters = document.getElementById('filters');
  let gen = '';

  for (let i = 0; i < geners.length; i++) {
    gen += `<input type="radio" class="radio-gens" id=${ geners[i] } value=${ i + 1 } name="generations" checked>
  <label for=${ geners[i] } class="label-gens">${ geners[i] }</label>`;
  }
  filters.innerHTML = gen;

  filters.addEventListener('click', function (e) {
    let targ = e.target.type;

    if (targ == 'radio') {
      getPokemons(e.target.value, toggle);
      title.innerHTML = 'Pokemon ' + e.target.id;
    }
  });
  //#endregion

});