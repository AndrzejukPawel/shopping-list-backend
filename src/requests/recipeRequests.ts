import { RequestDefinition } from '../interfaces/method';

export const getUserRecipes: RequestDefinition = {
    httpMethod: 'get',
    path: '/user',
    handler: (req, res) => {
        res.send({ code: 200 })
    }
}

export const getRecipe: RequestDefinition = {
    httpMethod: 'get',
    path: '/user',
    handler: (req, res) => {
        res.send({ code: 200 })
    }
}

export const createRecipe: RequestDefinition = {
    httpMethod: 'get',
    path: '/user',
    handler: (req, res) => {
        res.send({ code: 200 })
    }
}

export const updateRecipe: RequestDefinition = {
    httpMethod: 'get',
    path: '/user',
    handler: (req, res) => {
        res.send({ code: 200 })
    }
}

export const deleteRecipe: RequestDefinition = {
    httpMethod: 'get',
    path: '/user',
    handler: (req, res) => {
        res.send({ code: 200 })
    }
}
