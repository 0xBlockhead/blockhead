import { resolve } from '$app/paths'
import { redirect } from '@sveltejs/kit'

import { getCanonicalCastPathFromClientUrls } from '$/routes/(social)/(farcaster)/farcaster/getCanonicalCastPathFromClientUrls.ts'
import type { Source } from '$/sources/$Source.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { env } from '$env/dynamic/public'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const publicEnv = {
		PUBLIC_NEYNAR_API_KEY: env.PUBLIC_NEYNAR_API_KEY ?? '',
	} as SourcePublicEnvFor<Source.Neynar_Rest>

	const fname = typeof params.fname === 'string' ? params.fname.trim() : ''
	const hashSlug = typeof params.hash === 'string' ? params.hash.trim() : ''

	if (fname === '' || hashSlug === '') {
		redirect(303, resolve('/farcaster/feed'))
	}

	const target = await getCanonicalCastPathFromClientUrls(publicEnv, [
		`https://farcaster.xyz/${fname}/${hashSlug}`,
		`https://warpcast.com/${fname}/${hashSlug}`,
	])

	redirect(303, target ?? resolve('/farcaster/feed'))
}
