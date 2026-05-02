import { resolve } from '$app/paths'
import { redirect } from '@sveltejs/kit'

import { getCanonicalCastPathFromClientUrls } from '$/routes/(social)/(farcaster)/farcaster/getCanonicalCastPathFromClientUrls.ts'
import type { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { env } from '$env/dynamic/public'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
	const publicEnv = {
		PUBLIC_NEYNAR_API_KEY: env.PUBLIC_NEYNAR_API_KEY ?? '',
	} as SourcePublicEnvFor<Source.Neynar_Rest>

	const raw = url.searchParams.get('u') ?? url.searchParams.get('url')
	const clientUrl = typeof raw === 'string' ? raw.trim() : ''

	if (clientUrl === '' || !clientUrl.startsWith('http')) {
		redirect(303, resolve('/farcaster/feed'))
	}

	const target = await getCanonicalCastPathFromClientUrls(publicEnv, [clientUrl])

	redirect(303, target ?? resolve('/farcaster/feed'))
}
