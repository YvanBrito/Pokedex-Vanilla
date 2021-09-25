class HttpService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  
  async get(path) {
    let reqHeader = new Headers();
    reqHeader.append('Content-Type', 'text/json');

    let initObject = {
        method: 'GET',
        headers: reqHeader,
    };

    let userRequest = new Request(this.baseUrl.concat(path), initObject);
    let response = await fetch(userRequest);
    return await response.json();
  }
}

class PokedexModel {
  constructor(_id, _name, _types) {
    this.id = _id;
    this.name = _name;
    this.imageLink = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.id}.png`
    this.types = _types;
  }
}

class PokedexService{
  constructor() {
    this.baseUrl = 'https://pokeapi.co/api/v2/';
    this.httpService = new HttpService(this.baseUrl);
  }
  
  async getPokemonCompleteInfo(nameOrId) {
    return await this.httpService.get(`pokemon/${nameOrId}`);
  }
  
  async getPokemon(nameOrId) {
    const data = await this.httpService.get(`pokemon/${nameOrId}`);
    const pokemon = new PokedexModel(
      data.id,
      data.name,
      data.types
    );
    return pokemon;
  }
  
  async getPokemons(quantity, offset) {
    const data = await this.httpService.get(`pokemon?limit=${quantity}&offset=${offset}`);
    const pokemons = [];
    for(let d of data.results) {
      pokemons.push(await this.getPokemon(d.name));
    }
    
    return pokemons;
  }
}

class PokedexController {
  constructor() {
    this.service = new PokedexService(this.baseUrl);
  }
  
  async getPokemonCompleteInfo(nameOrId) {
    return await this.service.getPokemonCompleteInfo(nameOrId);
  }
  
  async getPokemonInfo(nameOrId) {
    return await this.service.getPokemon(nameOrId);
  }
  
  async getPokemons(quantity, offset) {
    return await this.service.getPokemons(quantity, offset);
  }
}

class PokedexView {
  constructor() {
    this.pokedexController = new PokedexController();
    this.numberOfPokemonsLoaded = 0;
    this.quantityToLoad = 20;
    this.searchInput = document.querySelector('.searchInput>input');
    this.panel = document.getElementById('panel');
  }
  
  async init() {
    this.loadMoreCards();
    this.addListeners();
  }
  
  addListeners() {
    document.getElementById('searchBtn').addEventListener('click', async () => {
        await this.searchInputEvent()
    });
    this.searchInput.addEventListener('keyup', async () => {
      if (event.isComposing || event.keyCode === 13) {
        await this.searchInputEvent()
      }
    });
    this.searchInput.addEventListener('input', async () => {
      if(this.searchInput.value === '') {
        this.numberOfPokemonsLoaded = 0;
        this.panel.innerHTML = '';
        await this.loadMoreCards();
      }
    });
  }
  
  async searchInputEvent() {
    let response = await this.loadSearchCard(this.searchInput.value);
    this.panel.innerHTML = response;
  }
  
  async loadSearchCard(pokemonName) {
    try {
      let response = await this.pokedexController.getPokemonInfo(pokemonName.toLowerCase())
      return this.createCard(response)
    } catch (error) {
      return '<h1>Pokemon not found</h1>'
    }
  }
  
  async loadMoreCards() {
    if (!this.loading) {
      this.loading = true;
      let pokemons = await this.pokedexController.getPokemons(this.quantityToLoad, this.numberOfPokemonsLoaded);
      this.loading = false;
      let cards = '';
      for (let i = 0; i < this.quantityToLoad; i++) {
        this.panel.appendChild(this.createCard(pokemons[i]))
      }
      // this.panel.insertAdjacentHTML('beforeend', cards);
      this.numberOfPokemonsLoaded += this.quantityToLoad;
    }
  }
  
  createCard(pokemon) {
    let spanPokemonNumber = document.createElement('span')
    spanPokemonNumber.setAttribute('class', 'pokenumber')
    spanPokemonNumber.innerText = `#${pokemon.id.toString().padStart(4, "0")}`
    
    let imgPokemon = document.createElement('img')
    imgPokemon.setAttribute('alt', pokemon.name)
    imgPokemon.setAttribute('src', pokemon.imageLink)
    
    let spanPokemonName = document.createElement('span')
    spanPokemonName.setAttribute('class', 'pokemonName')
    spanPokemonName.innerText = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    
    let typesDiv = document.createElement('div')
    typesDiv.setAttribute('class', 'types')
    let types = '';
    for (let type of pokemon.types) {
      let typeName = type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
      let typeSpan = document.createElement('span')
      typeSpan.setAttribute('class', type.type.name)
      typeSpan.innerText = typeName
      typesDiv.appendChild(typeSpan)
      types += `<span class="${type.type.name}">${typeName}</span>`;
    }
    
    let card = document.createElement('div')
    card.setAttribute('class', 'card')
    card.appendChild(spanPokemonNumber)
    card.appendChild(imgPokemon)
    card.appendChild(spanPokemonName)
    card.appendChild(typesDiv)
    
    card.addEventListener('click', async () => {
      await this.cardListener(card)
    });
    
    return card;
  }
  
  async cardListener(card) {
    let pokemonName = card.querySelector('.pokemonName').innerText.toLowerCase()
    
    document.getElementById('info').classList.remove('hide')
    
    // console.log(await this.pokedexController.getPokemonCompleteInfo(pokemonName))
  }
}

var pv = new PokedexView();
pv.init();

window.onscroll = function(){
  if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight && pv.searchInput.value === '') {
    pv.loadMoreCards();
  }
};

window.addEventListener('click', function(e){
	if (e.target === document.querySelector('html') ||
      e.target === document.getElementById('panel')){
  	document.getElementById('info').classList.add('hide');
  }
})
