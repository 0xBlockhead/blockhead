import { dev } from '$app/environment'
import { json } from '@sveltejs/kit'

import { runAssertLoadedResolverProbes } from './_runProbes.ts'

import type { RequestHandler } from './$types'


/** Dev-only: exercises `assertLoaded*` on rows built from enabled resolvers (probe ids + network). */
export const GET: RequestHandler = async () => {
	if (!dev) {
		return new Response('Not Found', { status: 404 })
	}

	return json(await runAssertLoadedResolverProbes())
}
