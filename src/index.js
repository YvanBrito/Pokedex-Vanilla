import PokedexView from "./classes/Pokedex/PokedexView";
import "./styles/style.scss";

var pv = new PokedexView();

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

pv.init();
