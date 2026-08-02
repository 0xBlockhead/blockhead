import { env } from '$env/dynamic/public'
import { error, redirect } from '@sveltejs/kit'

import { getCast } from '$/sources/Neynar/Rest/queries.ts'
import {
	parseFarcasterUrlIngress,
	verifyFarcasterIngressCast,
} from '../farcasterUrlIngress.ts'

import type { PageServerLoad } from './$types.ts'

export const load: PageServerLoad = async ({ url }) => {
	const urlInput = url.searchParams.get('url')
	const legacyUrlInput = url.searchParams.get('u')
	if (urlInput == null && legacyUrlInput == null)
		return {}

	let ingress
	try {
		const parsedUrl = urlInput == null ? undefined : parseFarcasterUrlIngress(urlInput)
		const parsedLegacyUrl = legacyUrlInput == null ? undefined : parseFarcasterUrlIngress(legacyUrlInput)
		if (
			parsedUrl !== undefined
			&& parsedLegacyUrl !== undefined
			&& JSON.stringify(parsedUrl) !== JSON.stringify(parsedLegacyUrl)
		)
			error(400, 'Farcaster URL parameters identify different targets')
		ingress = parsedUrl ?? parsedLegacyUrl
	} catch (reason) {
		error(400, reason instanceof Error ? reason.message : 'Invalid Farcaster URL')
	}
	if (ingress == null)
		error(400, 'A Farcaster URL is required')

	if (ingress.kind === 'profile')
		redirect(303, `/farcaster/user/${ingress.fid}`)
	if (ingress.kind === 'channel')
		redirect(303, `/farcaster/channel/${encodeURIComponent(ingress.channelId)}`)

	const cast = await getCast(
		{
			PUBLIC_NEYNAR_API_KEY: env.PUBLIC_NEYNAR_API_KEY,
		},
		{
			identifier: ingress.clientUrl,
			type: 'url',
		}
	)
	if (cast == null)
		error(503, 'Farcaster URL lookup is unavailable')

	let canonicalCast
	try {
		canonicalCast = verifyFarcasterIngressCast(ingress, cast)
	} catch (reason) {
		error(502, reason instanceof Error ? reason.message : 'Farcaster lookup result mismatch')
	}
	redirect(303, `/farcaster/cast/${canonicalCast.fid}/${canonicalCast.hash}`)
}
