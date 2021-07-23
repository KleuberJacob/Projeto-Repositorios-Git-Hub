import React, {useState, useCallback, useEffect} from 'react'
import { Link } from 'react-router-dom'

import { Container, Form, SubmitButton, List, DeleteButton } from './styles'
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'

import api from '../../Services/api'

export default function Main(){

    const [newRepo, setNewRepo] = useState('')
    const [repositorios, setRepositorios] = useState([])
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)

    //DidMount => busca os dados já salvos
    useEffect(() => {
        const repoStorage = localStorage.getItem("repositorios")

        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage))
        }

    }, [])

    //DidUpdate => atualiza o componente quando houver novos dados
    useEffect(() => {
        localStorage.setItem("repositorios", JSON.stringify(repositorios))
    }, [repositorios])


    const handleSubmit = useCallback((e) => {
        e.preventDefault()

        async function submit(){
            setLoading(true)

            try {
                
                if(newRepo === ''){
                    throw new Error('Necessário informar um repositório!')
                }

                const response = await api.get(`repos/${newRepo}`)

                const hasRepo = repositorios.find((repo) => repo.name === newRepo)

                if(hasRepo){
                    throw new Error('Repositório duplicado!')
                }
    
                const data = {
                    name: response.data.full_name
                }
        
                setRepositorios([...repositorios, data])
                setNewRepo('')

            } catch (error) {
                setAlert(true)
                console.log('Erro: ' + error)
            }finally{
                setLoading(false)
            }
        }

        submit()

    }, [newRepo, repositorios])
    
    function handleInputChange(e) {
        setNewRepo(e.target.value)
        setAlert(null)
    }

    const handleDelete = useCallback((repo) => {
        const find = repositorios.filter(r => r.name !== repo)
        setRepositorios(find)
    }, [repositorios])

    return(
        <Container>
            <h1>
                <FaGithub size={25}></FaGithub>
                Meus Repositórios
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>
                <input type="text" 
                placeholder= 'Adicionar Repositórios' 
                value={newRepo} 
                onChange={handleInputChange}/>

                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14}></FaSpinner>
                    ) : (
                        <FaPlus color='#fff' size={14}></FaPlus>
                    )}
                </SubmitButton>

            </Form>

            <List>
                {repositorios.map((repo) => (
                    <li key={repo.name}>
                        <span>
                        <DeleteButton onClick={() => handleDelete(repo.name)}>
                            <FaTrash size={14}></FaTrash>
                        </DeleteButton>    
                        {repo.name}</span>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20}></FaBars>
                        </Link>
                    </li>
                ))}        
            </List>

            
        </Container>
    )
}