import { createReadStream, statSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { extname, join, normalize, sep } from 'node:path'
import { Readable } from 'node:stream'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import type { Connect, Plugin, ViteDevServer } from 'vite'

type ApiModule = { default: (request: Request) => Promise<Response> }

const TESTING_MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
}

/**
 * Serves the repository `testing/` folder at `/testing/*` during `vite dev`
 * and `vite preview`, so the dev-only apartment sample loader can attach those
 * files exactly like a user picking them from disk.
 */
function serveTestingFolder(): Plugin {
  const root = fileURLToPath(new URL('./testing', import.meta.url))
  const middleware: Connect.NextHandleFunction = (request, response, next) => {
    const pathname = (request.url ?? '').split('?')[0]
    // `/testing` and `/testing/` are the app route (SPA fallback); only
    // `/testing/<file>` is a file request served from the repo testing/ folder.
    if (pathname === '/testing' || pathname === '/testing/') {
      next()
      return
    }
    if (!pathname.startsWith('/testing/')) {
      next()
      return
    }

    const relative = decodeURIComponent(pathname.slice('/testing/'.length))
    const filePath = normalize(join(root, relative))
    if (!filePath.startsWith(root + sep)) {
      response.statusCode = 403
      response.end('Forbidden')
      return
    }

    let stats
    try {
      stats = statSync(filePath)
    } catch {
      response.statusCode = 404
      response.end('Not found')
      return
    }
    if (!stats.isFile()) {
      response.statusCode = 404
      response.end('Not found')
      return
    }

    response.setHeader('Content-Type', TESTING_MIME_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream')
    response.setHeader('Content-Length', stats.size)
    response.setHeader('Cache-Control', 'no-store')
    createReadStream(filePath).pipe(response)
  }

  return {
    name: 'serve-testing-folder',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

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
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      react(),
      serveTestingFolder(),
      {
        name: 'assessment-api',
        configureServer(server) {
          server.middlewares.use('/api/submissions', createApiHandler(server, '/api/submissions', '/api/submissions.ts'))
          server.middlewares.use('/api/admin', createApiHandler(server, '/api/admin', '/api/admin.ts'))
        },
        configurePreviewServer(server) {
          server.middlewares.use('/api/submissions', createApiHandler(server as unknown as ViteDevServer, '/api/submissions', '/api/submissions.ts'))
          server.middlewares.use('/api/admin', createApiHandler(server as unknown as ViteDevServer, '/api/admin', '/api/admin.ts'))
        },
      },
    ],
  }
})
