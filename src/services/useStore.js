import { create } from 'zustand';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL

const useStore = create((set, get) => ({
  herramientas: [],
  obras: [],
  history: [],
  
  setHerramientas: (data) => set({ herramientas: data }),
  setObras: (listWork) => set({ obras: listWork }),
  updateWork: (data) => {
    const obras = get().obras
    const indexOfWork = obras.findIndex(work=> work.id === data.id)
    
    obras[indexOfWork] = {
      ...obras[indexOfWork],
      id: data.id,
      nombre: data.nombre,
      direccion: data.direccion
    }
    
    set({obras})
    
  },
  agregarHerramienta: (nuevaHerramienta)=> set((state)=> ({
    herramientas: [...state.herramientas, nuevaHerramienta]
  })),
  agregarObra: (nuevaObra)=> set((state)=> ({
    obras: [...state.obras, nuevaObra]
  })),

  getHerramienta: (idTool)=>{
    const tools = get().herramientas
    const tool = tools.find(tool=> tool.id === idTool)  
    return tool
  },
  // Devuelve una lista de las Obras donde está esa herramienta pero solo con la herramienta buscada
  getWorkByNameTool: (nameTool)=>{
    const works = get().obras
    
    const toolsInWork = works.map((work)=>{
      let isFind = false
      const listTool = work.herramientas_enObra
      const listToolFilter = []
      
      for(let i=0; i < listTool.length; i++){
        
        isFind = listTool[i].nombre.trim().toLowerCase().includes(nameTool.toLowerCase())

        if(isFind) {
          listToolFilter.push(listTool[i])
        } 
      };

      if(listToolFilter.length > 0){
        return {
          ...work,
        herramientas_enObra: listToolFilter
        }

      }
      return undefined

    })
    
    return toolsInWork.filter((elem)=> elem !== undefined)
  },

  cargarDatosDesdeAPI: async () => {
    const herramientasRes = await fetch(`${apiBaseUrl}/herramientas`);
    const obrasRes = await fetch(`${apiBaseUrl}/obras`);
    const historyRes = await fetch(`${apiBaseUrl}/history`)

    const herramientas = await herramientasRes.json();
    const obras = await obrasRes.json();
    const history = await historyRes.json();

    set({ herramientas, obras, history });
  }
}));

export default useStore;
