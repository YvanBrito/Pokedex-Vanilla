import PokedexController from "./PokedexController";

export default class PokedexView {
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
    this.searchInput.addEventListener('keyup', async (event) => {
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
    this.loading = true;
    let response = await this.loadSearchCard(this.searchInput.value);
    this.loading = false;
    this.panel.innerHTML = '';
    this.panel.appendChild(response);
  }
  
  async loadSearchCard(pokemonName) {
    try {
      let response = await this.pokedexController.getPokemonInfo(pokemonName.toLowerCase())
      return this.createCard(response)
    } catch (error) {
      const notFound = document.createElement('h1');
      notFound.setAttribute('class', 'notFound');
      notFound.innerText = 'Pokemon not found';
      return notFound;
    }
  }
  
  async loadMoreCards() {
    if (!this.loading) {
      this.loading = true;
      let pokemons = await this.pokedexController.getPokemons(this.quantityToLoad, this.numberOfPokemonsLoaded);
      this.loading = false;
      pokemons.forEach((pokemon) => {
        this.panel.appendChild(this.createCard(pokemon))
      });
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
    let pokemonName = card.querySelector('.pokemonName').innerText.toLowerCase();
    
    document.getElementById('info').classList.remove('hide');
    
    console.log(await this.pokedexController.getPokemonCompleteInfo(pokemonName));
  }
}