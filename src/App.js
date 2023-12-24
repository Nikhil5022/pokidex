import './App.css';
import Pokimon from './Pokimon';

function App() {
  return (
    <body className="h-screen">

      <nav className="bg-blue-500 text-white py-4 px-6 w-full text-3xl font-bold shadow-md flex items-center justify-between fixed top-0 z-50">
        <span className="hidden lg:block">POKÉDEX</span>
        <span className="lg:hidden mx-auto">POKÉDEX</span>
      </nav>

      <Pokimon />
    </body>
  );
}

export default App;
