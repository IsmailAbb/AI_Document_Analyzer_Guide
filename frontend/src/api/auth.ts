import client from './client'

export const register = (email: string, password: string) =>
  client.post('/auth/register', { email, password })

export const login = (email: string, password: string) =>
  client.post('/auth/login', { email, password })