import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/sonner.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

// 👉 DndProvider import cheyyanam
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* 🔑 Single time mathram DndProvider wrap cheyyanam */}
        <DndProvider backend={HTML5Backend}>
          <App />
          <Toaster />
        </DndProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
