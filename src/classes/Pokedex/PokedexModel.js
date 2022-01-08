export default class PokedexModel {
  constructor(_id, _name, _types) {
    this.id = _id;
    this.name = _name;
    this.imageLink = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.id}.png`
    this.types = _types;
  }
}