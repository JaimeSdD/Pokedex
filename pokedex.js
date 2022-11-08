const container$$ = document.querySelector(".container");
const search$$ = document.querySelector(".search");
const all$$ = document.querySelector(".all");
const kanto$$ = document.querySelector(".kanto");
const johto$$ = document.querySelector(".johto");
const hoenn$$ = document.querySelector(".hoenn");
const flip$$ = document.querySelector(".flip");
let allPokemon = [];
let allRegionPokemon = [];
let allFilteredPokemon = [];
let pokemonRegion = {};
let isBack = false;

const colors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const getAllPokemon = async () => {
  const petition = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=386");
  const data = await petition.json();
  const allPokemon = await Promise.all(
    data.results.map(async ({ url }) => {
      const response = await fetch(url);
      const pokemon = await response.json();
      return pokemon;
    })
  );
  return allPokemon;
};

const main = async () => {
  allPokemon = await getAllPokemon();
  allRegionPokemon = allPokemon;
  allFilteredPokemon = allPokemon;
  renderPokemon(allPokemon);

  pokemonRegion.kanto = allPokemon.slice(0, 151);
  pokemonRegion.johto = allPokemon.slice(151, 251);
  pokemonRegion.hoenn = allPokemon.slice(251, 386);

  search$$.addEventListener("input", () => swissKnife(allRegionPokemon));
  all$$.addEventListener("click", () => swissKnife(allPokemon));
  kanto$$.addEventListener("click", () => swissKnife(pokemonRegion.kanto));
  johto$$.addEventListener("click", () => swissKnife(pokemonRegion.johto));
  hoenn$$.addEventListener("click", () => swissKnife(pokemonRegion.hoenn));
  flip$$.addEventListener("click", () => flipping(allFilteredPokemon));
};

const swissKnife = (pokemonReceived) => {
  whitePaper();
  allRegionPokemon = pokemonReceived;
  allFilteredPokemon = searcher(allRegionPokemon);
  renderPokemon(allFilteredPokemon);
};

const renderPokemon = (pokemonReceived) => {
  whitePaper();
  pokemonReceived.forEach((pokemon) => createPokemonCard(pokemon, !isBack));

  if (pokemonReceived.length === 0)
    container$$.innerHTML = `
    <div class = "error-container">
    <img class ="error-img" src = "https://www.pngall.com/wp-content/uploads/4/Pokemon-Pokeball-PNG-Image-HD.png">
    <h3 class = "error-text">Ouh! It seems that you haven't catch any pokemon. Try again! <br> (Your search doesn't match any pokemon)
</h3>
</div>
`;
};

const searcher = (allRegionPokemon) => {
  container$$.innerHTML = "";
  let pokemonFiltered = [];

  for (const pokemon of allRegionPokemon) {
    const searchName = pokemon.name.includes(
      search$$.value.toLowerCase().trim()
    );
    const searchId = pokemon.id.toString().includes(search$$.value.trim());
    const searchTypes = pokemon.types.some(({ type }) =>
      type.name.includes(search$$.value.toLowerCase().trim())
    );

    if (searchName || searchId || searchTypes) {
      pokemonFiltered.push(pokemon);
    }
  }
  return pokemonFiltered;
};

const whitePaper = () => (container$$.innerHTML = "");

const flipping = (allPokemon) => {
  whitePaper();
  if (isBack) {
    allPokemon.forEach((pokemon) => createPokemonCard(pokemon));
    isBack = false;
  } else {
    allPokemon.forEach((pokemon) => createPokemonCard(pokemon, false));
    isBack = true;
  }
};

const typeSearcher = (typeName) => {
  search$$.value = typeName;
  swissKnife(allRegionPokemon);
};

function createPokemonCard(pokemon, isFront = true) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card-container");
  cardContainer.id = pokemon.id;

  container$$.appendChild(cardContainer);
  isFront ? createPokemonFront(pokemon) : createPokemonBack(pokemon);
}

function createPokemonFront(pokemon) {
  const cardContainer = document.getElementById(pokemon.id);
  const nameFirstUpper = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  const type = pokemon.types[0].type.name;
  const color = colors[search$$.value] || colors[type];
  cardContainer.style.backgroundColor = color;
  cardContainer.style.padding = "20px";
  cardContainer.style.width = "160px";
  cardContainer.style.minHeight = "345px";
  const image = pokemon.sprites.other["official-artwork"].front_default;

  const h3Creator = (types) => {
    let result = "";
    types.forEach(({ type }) => {
      result += `<h3 style = "color:${
        colors[type.name]
      }" onclick ="event.stopPropagation(); typeSearcher('${type.name}')" > ${
        type.name[0].toUpperCase() + type.name.slice(1)
      } </h3>`;
    });
    return result;
  };

  const cardInnerHtml = ` 
  <div class = "img-container">
  <img src = ${image}>
  </div>
  <div class = "info">
  <div class = "number">#${pokemon.id}</div>
  <h2 class = "name"> ${nameFirstUpper}</h2>
  <div class = "type"> 
  ${h3Creator(pokemon.types)}
  </div>
  </div>
  `;

  cardContainer.innerHTML = cardInnerHtml;

  cardContainer.addEventListener("click", () => createPokemonBack(pokemon), {
    once: true,
  });
}

async function createPokemonBack(pokemon) {
  const cardContainer = document.getElementById(pokemon.id);

  const type = pokemon.types[0].type.name;
  const color = colors[search$$.value] || colors[type];
  cardContainer.style.backgroundColor = "azure";
  cardContainer.style.padding = "0";
  cardContainer.style.width = "200px";
  cardContainer.style.minHeight = "385.65px";
  const gif = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.id}.gif`;

  const getSpecies = async ({ url }) => {
    const request = await fetch(url);
    const species = await request.json();
    const description = species.flavor_text_entries
      .find(({ language }) => language.name === "en")
      .flavor_text.replace("\f", " ");
    return description;
  };

  let description = await getSpecies(pokemon.species);
  const fantasy = `<a onclick = "event.stopPropagation(); easterEgg()">random</a>`;
  description = description.replace("random", fantasy);

  const statsCreator = (stats) => {
    let result = "";
    const short = {
      "special-attack": "Sp.Atk",
      "special-defense": "Sp.Def",
      hp: "Hp",
      defense: "Def",
      attack: "Atk",
      speed: "Speed",
    };

    stats.forEach(({ stat, base_stat }) => {
      result += `<p>${short[stat.name]}:</p><p>${base_stat}</p>`;
    });
    return result;
  };

  const cardInnerHtml = `
  <div class = "img-container-back">
  <img src = ${gif}>
  </div>
  <div style = "background-color: ${color}" class = "color-container">
  <div class = "description" >
  <p>${description}</p>
  </div>
  <div class = "stats"> 
  ${statsCreator(pokemon.stats)}
  </div>
  </div>
  `;

  cardContainer.innerHTML = cardInnerHtml;

  cardContainer.addEventListener("click", () => createPokemonFront(pokemon), {
    once: true,
  });
}

const board$$ = document.createElement("div");
board$$.classList.add("board");
let clicks = 0;
let pokemon1;
let pokemon2;
let score = 0;
let semaphore = false;
let timer = 30000;

const easterEgg = () => {
  document.body.innerHTML = "";
  const timer$$ = document.createElement("h5");
  timer$$.classList.add("clock");
  timer$$.innerText = timer / 1000;
  document.body.appendChild(timer$$);
  document.body.appendChild(board$$);

  allPokemon = allPokemon.sort(() => Math.random() - 0.5).slice(0, 10);
  allPokemonSorted = [
    ...allPokemon,
    ...allPokemon.map((el) => ({
      ...el,
      id: el.id + 1000,
    })),
  ];
  allPokemonSorted = allPokemonSorted.sort(() => Math.random() - 0.5);
  search$$.value = "";
  allPokemonSorted.forEach((pokemon) => {
    cardContainer = memoryCard(pokemon);
    cardContainer.addEventListener("click", () => memoryFlip(pokemon));
  });
  const clock = setInterval(() => {
    if (score === 10) {
      clearInterval(clock);
      clearTimeout(illidan);
    } else if (timer === 0){
      clearInterval(clock);
    } else {timer = timer - 1000}
    timer$$.innerText = timer / 1000;
  }, 1000);
  const illidan = setTimeout(() => {
    document.body.innerHTML = `<img src ="https://i.ytimg.com/vi/cedAVx7sRB8/hqdefault.jpg">`;
  }, timer + 1000);
};

const checker = (pokemon1, pokemon2) => {
  semaphore = true;
  if (pokemon1.name === pokemon2.name) {
    setTimeout(() => {
      score++;
      pokemon1.name = "correct";
      pokemon2.name = "correct";
      if (score === 10) {
        document.body.innerHTML = `<img src = "https://media.tenor.com/2-AEeBY5wgwAAAAC/chuck-norris-thumbs-up.gif">`;
      }
      semaphore = false;
    }, 500);
  } else {
    setTimeout(() => {
      memoryFront(pokemon1);
      memoryFront(pokemon2);
      semaphore = false;
    }, 500);
  }

  clicks = 0;
};

const memoryFlip = (pokemon) => {
  if (pokemon.name !== "correct" && !semaphore) {
    memoryBack(pokemon);
    clicks++;
    if (clicks === 1) {
      pokemon1 = pokemon;
    } else if (pokemon.id !== pokemon1?.id && clicks === 2 ) {
      pokemon2 = pokemon;
      checker(pokemon1, pokemon2);
    } else {clicks = 1}
  }
};

function memoryCard(pokemon, isFront = true) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("memory-card-container");
  cardContainer.id = pokemon.id;

  board$$.appendChild(cardContainer);
  isFront ? memoryFront(pokemon) : memoryBack(pokemon);
  return cardContainer;
}

function memoryFront(pokemon) {
  const cardContainer = document.getElementById(pokemon.id);
  cardContainer.style.padding = "0";
  cardContainer.style.width = "100px";
  cardContainer.style.height = "133px";

  const cardInnerHtml = ` 
  <div class = "img-container">
  <img src = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4f7705ec-8c49-4eed-a56e-c21f3985254c/dah43cy-a8e121cb-934a-40f6-97c7-fa2d77130dd5.png/v1/fill/w_1024,h_1420,strp/pokemon_card_backside_in_high_resolution_by_atomicmonkeytcg_dah43cy-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTQyMCIsInBhdGgiOiJcL2ZcLzRmNzcwNWVjLThjNDktNGVlZC1hNTZlLWMyMWYzOTg1MjU0Y1wvZGFoNDNjeS1hOGUxMjFjYi05MzRhLTQwZjYtOTdjNy1mYTJkNzcxMzBkZDUucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.9GzaYS7sd8RPY5FlHca09J9ZQZ9D9zI69Ru-BsbkLDA">
  </div>`;

  cardContainer.innerHTML = cardInnerHtml;
}

function memoryBack(pokemon) {
  const cardContainer = document.getElementById(pokemon.id);

  const type = pokemon.types[0].type.name;
  const color = colors[type];
  cardContainer.style.backgroundColor = color;
  const image = pokemon.sprites.other["official-artwork"].front_default;

  cardContainer.style.width = "100px";
  cardContainer.style.height = "140px";

  const cardInnerHtml = `
  <div class = "img-container">
  <img src = ${image}>
  </div>`;

  cardContainer.innerHTML = cardInnerHtml;
}

main()
