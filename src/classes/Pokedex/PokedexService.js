import HttpService from "../HttpService";
import PokedexModel from "./PokedexModel";

export default class PokedexService{
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
    for(let d in data.results) {
      console.log(`${d} de ${data.results.length}`);
      pokemons.push(await this.getPokemon(data.results[d].name));
    }
    
    return pokemons;
  }
}