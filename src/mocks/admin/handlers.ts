import { http, HttpResponse } from 'msw'
import { adminUsers } from './users'

export const adminHandlers = [http.get('/api/admin/users', () => HttpResponse.json({ users: adminUsers }))]
