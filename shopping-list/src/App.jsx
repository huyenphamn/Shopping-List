
import styles from './App.module.css'
import { Navbar } from './components/Navbar/Navbar'
import { ShoppingList } from './components/Shopping List/ShoppingList'

function App() {
  

  return (
    <div className={styles.App}>
      <Navbar/>
      <ShoppingList/>
    </div>
  )
}

export default App
