import { Readable } from 'node:stream'
import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import type { ViteDevServer } from 'vite'

type ApiModule = { default: (request: Request) => Promise<Response> }

function createApiHandler(server: ViteDevServer, route: string, modulePath: string) {
  return async (incoming: IncomingMessage, outgoing: ServerResponse) => {
    try {
      const method = incoming.method ?? 'GET'
      const headers = new Headers()
      for (const [name, value] of Object.entries(incoming.headers)) {
        if (Array.isArray(value)) headers.set(name, value.join(', '))
        else if (value) headers.set(name, value)
      }

      const init: RequestInit & { duplex?: 'half' } = { method, headers }
      if (method !== 'GET' && method !== 'HEAD') {
        init.body = Readable.toWeb(incoming) as ReadableStream<Uint8Array>
        init.duplex = 'half'
      }
      // The mount path is stripped by connect; the query string is preserved,
      // which is all the API handlers depend on.
      const request = new Request(
        new URL(incoming.url ?? '/', `http://${incoming.headers.host ?? 'localhost'}`),
        init,
      )
      const apiModule = (await server.ssrLoadModule(modulePath)) as ApiModule
      const response = await apiModule.default(request)
      outgoing.statusCode = response.status
      response.headers.forEach((value, name) => outgoing.setHeader(name, value))
      outgoing.end(await response.text())
    } catch (error) {
      console.error(`Local API failed (${route}):`, error)
      outgoing.statusCode = 500
      outgoing.setHeader('Content-Type', 'application/json')
      outgoing.end(JSON.stringify({ error: 'API failed. Please try again.' }))
    }
  }
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [
      react(),
      {
        name: 'assessment-api',
        configureServer(server) {
          server.middlewares.use('/api/submissions', createApiHandler(server, '/api/submissions', '/api/submissions.ts'))
          server.middlewares.use('/api/admin', createApiHandler(server, '/api/admin', '/api/admin.ts'))
        },
      },
    ],
  }
})
