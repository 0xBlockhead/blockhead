import { dev } from '$app/environment'
import { json } from '@sveltejs/kit'

import { runAssertLoadedResolverProbes } from './_runProbes.ts'

import type { RequestHandler } from './$types'


/** Dev-only: exercises `assertLoaded*` on rows built from enabled resolvers (probe ids + network). */
export const GET: RequestHandler = async ({ url }) => {
	if (!dev) {
		return new Response('Not Found', { status: 404 })
	}

	try {
		return json(await runAssertLoadedResolverProbes(url.searchParams.get('includes') ?? undefined))
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error)
		const stack = error instanceof Error ? error.stack : undefined
		return json({ probeRunnerError: message, stack }, { status: 500 })
	}
}
