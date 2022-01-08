import PokedexService from "./PokedexService";

export default class PokedexController {
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