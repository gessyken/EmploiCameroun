import React from 'react';

const TestTailwind = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Test Tailwind CSS
        </h1>
        <p className="text-gray-600 mb-4">
          Si vous voyez ce texte stylé, Tailwind CSS fonctionne !
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Bouton de test
        </button>
      </div>
    </div>
  );
};

export default TestTailwind;
