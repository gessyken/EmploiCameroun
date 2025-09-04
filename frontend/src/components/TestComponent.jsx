import React from 'react';

const TestComponent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">E</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            EmploiCameroun
          </h1>
          <p className="text-xl text-gray-600">
            Test de Tailwind CSS
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            ✅ Tailwind CSS fonctionne parfaitement !
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Couleurs</h3>
              <p className="text-blue-700 text-sm">Gradients et couleurs appliqués</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">Espacement</h3>
              <p className="text-purple-700 text-sm">Padding et margins corrects</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Bouton Principal
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors">
              Bouton Secondaire
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg transition-colors">
              Bouton Outline
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Classes utilisées :</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <code className="bg-gray-200 px-1 rounded">min-h-screen</code> - Hauteur minimale</li>
              <li>• <code className="bg-gray-200 px-1 rounded">bg-gradient-to-br</code> - Dégradé</li>
              <li>• <code className="bg-gray-200 px-1 rounded">rounded-2xl</code> - Bordures arrondies</li>
              <li>• <code className="bg-gray-200 px-1 rounded">shadow-2xl</code> - Ombre portée</li>
              <li>• <code className="bg-gray-200 px-1 rounded">grid grid-cols-2</code> - Grille responsive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestComponent;
