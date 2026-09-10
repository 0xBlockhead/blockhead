const acceptedHosts = new Set([
	'farcaster.xyz',
	'warpcast.com',
])
const fullHashPattern = /^0x[0-9a-f]{40}$/
const hashPrefixPattern = /^0x[0-9a-f]{8,40}$/
const usernamePattern = /^[a-z0-9][a-z0-9.-]{0,15}$/
const channelIdPattern = /^[a-z0-9][a-z0-9-]{0,63}$/

export type FarcasterUrlIngress =
	| {
		kind: 'profile'
		fid: number
	}
	| {
		kind: 'channel'
		channelId: string
	}
	| {
		kind: 'cast'
		clientUrl: string
		hashPrefix: `0x${string}`
		username?: string
		fullHash: boolean
	}

export const parseFarcasterUrlIngress = (input: string): FarcasterUrlIngress => {
	if (
		input.length === 0
		|| input.length > 512
		|| /[\u0000-\u001f\u007f\\]/.test(input)
		|| /%(?:2f|5c|2e)/i.test(input)
	)
		throw new Error('Invalid Farcaster URL')

	let url: URL
	try {
		url = new URL(input)
	} catch {
		throw new Error('Invalid Farcaster URL')
	}
	if (
		url.protocol !== 'https:'
		|| !acceptedHosts.has(url.hostname.toLowerCase())
		|| url.port !== ''
		|| url.username !== ''
		|| url.password !== ''
		|| url.hash !== ''
		|| url.search !== ''
	)
		throw new Error('Unsupported Farcaster URL')

	const segments = url.pathname.split('/').filter(Boolean).map((segment) => {
		try {
			return decodeURIComponent(segment)
		} catch {
			throw new Error('Invalid Farcaster URL encoding')
		}
	})
	if (segments.length > 3 || segments.some((segment) => segment === '.' || segment === '..'))
		throw new Error('Unsupported Farcaster URL path')

	if (segments[0] === '~' && segments[1] === 'profiles' && segments.length === 3) {
		const fid = Number(segments[2])
		if (!Number.isSafeInteger(fid) || fid < 1 || String(fid) !== segments[2])
			throw new Error('Invalid Farcaster FID')

		return {
			kind: 'profile',
			fid,
		}
	}

	if (
		segments[0] === '~'
		&& (segments[1] === 'channel' || segments[1] === 'channels')
		&& segments.length === 3
		&& channelIdPattern.test(segments[2])
	)
		return {
			kind: 'channel',
			channelId: segments[2],
		}

	if (
		segments[0] === '~'
		&& segments[1] === 'conversations'
		&& segments.length === 3
		&& fullHashPattern.test(segments[2].toLowerCase())
	)
			return {
				kind: 'cast',
				clientUrl: `https://${url.hostname.toLowerCase()}/~/conversations/${segments[2].toLowerCase()}`,
				hashPrefix: `0x${segments[2].toLowerCase().slice(2)}`,
				fullHash: true,
			}

	if (
		segments.length === 2
		&& usernamePattern.test(segments[0].toLowerCase())
		&& hashPrefixPattern.test(segments[1].toLowerCase())
	)
			return {
				kind: 'cast',
				clientUrl: `https://${url.hostname.toLowerCase()}/${segments[0].toLowerCase()}/${segments[1].toLowerCase()}`,
				username: segments[0].toLowerCase(),
				hashPrefix: `0x${segments[1].toLowerCase().slice(2)}`,
				fullHash: segments[1].length === 42,
			}

	throw new Error('Unsupported Farcaster URL path')
}

export const verifyFarcasterIngressCast = (
	ingress: Extract<FarcasterUrlIngress, { kind: 'cast' }>,
	cast: {
		hash: string
		author?: {
			fid?: number
			username?: string
		}
	}
) => {
	const hash = cast.hash.toLowerCase()
	const fid = cast.author?.fid
	if (
		!fullHashPattern.test(hash)
		|| !hash.startsWith(ingress.hashPrefix)
		|| fid == null
		|| !Number.isSafeInteger(fid)
		|| (
			ingress.username !== undefined
			&& cast.author.username?.toLowerCase() !== ingress.username
		)
	)
		throw new Error('Farcaster lookup result does not match the requested URL')

	return {
		fid,
		hash,
	}
}
