import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const PokemonList = () => {
  const [fullPokemonData, setFullPokemonData] = useState([]);
  const [fullPokemonData1, setFullPokemonData1] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const containerRef = useRef(null);

  const fetchFullPokemonData = async () => {
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=200`);
      const tempdata = res.data.results;
      const promises = tempdata.map(async (item, index) => {
        const response = await axios.get(item.url);
        const pokitempdata = response.data;
        return {
          name: item.name,
          height: pokitempdata.height,
          weight: pokitempdata.weight,
          type: pokitempdata.types[0].type.name,
          hp: pokitempdata.stats[0].base_stat,
          attack: pokitempdata.stats[1].base_stat,
          defense: pokitempdata.stats[2].base_stat,
          specialAttack: pokitempdata.stats[3].base_stat,
          specialDefense: pokitempdata.stats[4].base_stat,
          speed: pokitempdata.stats[5].base_stat,
          img: `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${index + 1}.svg`
        };
      });

      const data = await Promise.all(promises);
      setFullPokemonData(data);
      setFullPokemonData1(data);
    } catch (error) {
      console.error('Error fetching full data:', error);
    }
  };

  useEffect(() => {
    fetchFullPokemonData();
  }, []);

  const typeColors = {
    grass: '#78C850',
    fire: '#F08030',
    water: '#6890F0',
    bug: '#A8B820',
    normal: '#A8A878',
    poison: '#A040A0',
    electric: '#F8D030',
    ground: '#E0C068',
    fairy: '#EE99AC',
    fighting: '#C03028',
    psychic: '#F85888',
    rock: '#B8A038',
    ghost: '#705898',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    flying: '#A890F0',
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredByName = fullPokemonData1.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm)
    );

    const filteredPokemon = selectedType !== 'all'
      ? filteredByName.filter(pokemon => pokemon.type === selectedType)
      : filteredByName;

    setFullPokemonData(filteredPokemon);
  };

  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    setSelectedType(selectedType);

    const filteredPokemon = selectedType !== 'all'
      ? fullPokemonData1.filter(pokemon => pokemon.type === selectedType)
      : fullPokemonData1;

    setFullPokemonData(filteredPokemon);
  };


  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const closeModal = () => {
    setSelectedPokemon(null);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);


  return (
    <>
      <div className='lg:m-3 sm:m-2'>
        <div className="container mx-auto mt-8" ref={containerRef}>
          <h1 className="text-4xl font-bold mb-8">Pokémon List</h1>
          <div className="flex items-center mb-4">
            <label htmlFor="typeFilter" className="mr-2">
              Filter by Type:
            </label>
            <select
              id="typeFilter"
              value={selectedType}
              onChange={handleTypeChange}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Types</option>
              {Object.keys(typeColors).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Search Pokémon"
            className="mt-4 p-2 border border-gray-300 rounded-md"
            onChange={handleSearch}
          />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 m-2">
            {fullPokemonData.map((pokemon, index) => (
              <div
                key={index}
                className="bg-white rounded-md shadow-lg p-4 transition transform hover:scale-105"
                style={{
                  backgroundColor: typeColors[pokemon.type] || '#FFFFFF',
                  margin: '8px',
                  cursor: 'pointer',
                }}
                onClick={() => openModal(pokemon)}
              >
                <h2 className="text-xl font-semibold">{pokemon.name}</h2>
                <p>Type: {pokemon.type}</p>
                <div className="flex justify-center">
                  <img
                    src={pokemon.img}
                    alt=""
                    className="w-40 h-24"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPokemon && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md w-full lg:m-20 z-80">
            <h2 className="text-2xl font-semibold mb-4">{selectedPokemon.name}</h2>
            <div className="flex justify-center mb-4">
              <img
                src={selectedPokemon.img}
                alt=""
                className="w-40 h-24"
              />
            </div>

            <div className="mb-4">
              <p>HP: <span className='font-bold'>{selectedPokemon.hp}</span></p>
              <div className="bg-green-500 h-4 border border-black" style={{ width: `${(selectedPokemon.hp / 150) * 100}%` }}></div>
            </div>

            <div className="mb-4">
              <p>Attack: <span className='font-bold'>{selectedPokemon.attack}</span></p>
              <div className="bg-red-500 h-4" style={{ width: `${(selectedPokemon.attack / 150) * 100}%` }}></div>
            </div>

            <div className="mb-4">
              <p>Defense: <span className='font-bold'>{selectedPokemon.defence}</span></p>
              <div className="bg-blue-500 h-4" style={{ width: `${(selectedPokemon.defense / 150) * 100}%` }}></div>
            </div>

            <div className='mb-4'>
              <p>Speed: <span className='font-bold'>{selectedPokemon.speed}</span></p>
              <div className="bg-yellow-500 h-4" style={{ width: `${(selectedPokemon.speed / 150) * 100}%` }}></div>
            </div>

            <div className='mb-4'>
              <p>Special Attack: <span className='font-bold'>{selectedPokemon.specialAttack}</span></p>
              <div className="bg-purple-500 h-4" style={{ width: `${(selectedPokemon.specialAttack / 150) * 100}%` }}></div>
            </div>

            <div className='mb-4'>
              <p>Special Defense: <span className='font-bold'>{selectedPokemon.specialDefense}</span></p>
              <div className="bg-pink-500 h-4" style={{ width: `${(selectedPokemon.specialDefense / 150) * 100}%` }}></div>
            </div>

            <div className='flex justify-end'>
              <button className="mt-4 p-2 bg-blue-500 text-white rounded-md" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PokemonList;
