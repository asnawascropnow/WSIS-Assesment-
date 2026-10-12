import { Readable } from 'node:stream'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [
      react(),
      {
        name: 'assessment-submissions-api',
        configureServer(server) {
          server.middlewares.use('/api/submissions', async (incoming, outgoing) => {
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
              const request = new Request(
                new URL(incoming.url ?? '/', `http://${incoming.headers.host ?? 'localhost'}`),
                init,
              )
              const apiModule = await server.ssrLoadModule('/api/submissions.ts')
              const submitAssessment = apiModule.default as (request: Request) => Promise<Response>
              const response = await submitAssessment(request)
              outgoing.statusCode = response.status
              response.headers.forEach((value, name) => outgoing.setHeader(name, value))
              outgoing.end(await response.text())
            } catch (error) {
              console.error('Local assessment API failed:', error)
              outgoing.statusCode = 500
              outgoing.setHeader('Content-Type', 'application/json')
              outgoing.end(JSON.stringify({ error: 'Submission API failed. Please try again.' }))
            }
          })
        },
      },
    ],
  }
})
