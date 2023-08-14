import { useQueryClient } from '@tanstack/react-query'
import {useQuery} from '@tanstack/react-query'
import {getUser, createUser, getRequest, createRequest, getLineas} from '../BusBuddy-Backend/src/database.js'

const queryClient = new queryClient()


function crearUsuario() {
    // Access the client
    const queryClient = useQueryClient()
  
    // Queries
    const nuevoUsuario  = useQuery({ queryKey: ['creadoUsuario'], queryFn: createUser })
}

function traerUsuario(){
    const queryClient = useQueryClient()
    const getUsuario = useQuery({ queryKey: ['llamarColectivo'], queryFn: getUser})
}

function crearAlerta(){
    const queryClient = useQueryClient()
    const nuevaAlerta = useQuery({ queryKey: ['alertaColectivo'], queryFn: createRequest})
}

function traerAlerta(){
    const queryClient = useQueryClient()
    const getAlerta = useQuery({ queryKey: ['traerAlertaColectivo'], queryFn: getRequest})
}

function traerLineas(){
    const queryClient = useQueryClient()
    const Lineas = useQuery({ queryKey: ['traerLineas'], queryFn: getLineas})
}