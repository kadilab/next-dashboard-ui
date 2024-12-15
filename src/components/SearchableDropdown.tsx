import { useEffect, useRef, useState } from "react";

const SearchableDropdown = ({
  options, // Liste des utilisateurs ou options
  label, // Le champ à afficher dans la liste (par exemple, "name" ou "email")
  id, // Identifiant unique pour le dropdown
  selectedVal, // Valeur sélectionnée
  handleChange, // Fonction callback pour gérer la sélection
}) => {
  const [query, setQuery] = useState(""); // Requête de recherche
  const [isOpen, setIsOpen] = useState(false); // État d'ouverture du dropdown

  const inputRef = useRef(null);

  // Gestion de l'ouverture/fermeture du dropdown
  useEffect(() => {
    const toggleDropdown = (e) => {
      if (e.target !== inputRef.current) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", toggleDropdown);
    return () => document.removeEventListener("click", toggleDropdown);
  }, []);

  const selectOption = (option) => {
    setQuery(""); // Réinitialise la recherche
    handleChange(option); // Envoie l'objet sélectionné
    setIsOpen(false); // Ferme le dropdown
  };

  const getDisplayValue = () => {
    if (query) return query; // Affiche la recherche
    if (selectedVal) return selectedVal[label]; // Affiche la valeur sélectionnée
    return ""; // Valeur par défaut
  };

  const filterOptions = () => {
    return options.filter((option) => {
      const value = option[label]; // Récupère la valeur en fonction du label
      return value && value.toLowerCase().includes(query.toLowerCase()); // Vérifie que value n'est pas undefined
    });
  };

  return (
    <div className="dropdown relative">
      {/* Champ de saisie */}
      <div className="control">
        <input
          ref={inputRef}
          type="text"
          value={getDisplayValue()}
          name="searchTerm"
          placeholder="Rechercher..."
          onChange={(e) => {
            setQuery(e.target.value); // Met à jour la recherche
            handleChange(null); // Réinitialise la sélection
          }}
          onClick={() => setIsOpen(true)} // Ouvre le dropdown
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Liste des options */}
      {isOpen && (
        <div className="options absolute z-10 bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto w-full mt-1">
          {filterOptions().map((option, index) => (
            <div
              key={`${id}-${index}`}
              onClick={() => selectOption(option)}
              className={`option p-2 hover:bg-blue-100 cursor-pointer ${
                selectedVal && selectedVal[label] === option[label]
                  ? "bg-blue-100"
                  : ""
              }`}
            >
              {option[label]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
