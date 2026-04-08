import { snapchainGet } from '$/sources/Snapchain/Rest/client.ts'

export const GET = async ({
	params,
	url,
}) => {
	const path = params.path
	if (typeof path !== 'string' || path.length === 0) {
		return new Response('Missing Snapchain path', { status: 400 })
	}

	const snapchainPath = `/${path}`
	if (!snapchainPath.startsWith('/v1/')) {
		return new Response('Unsupported Snapchain path', { status: 404 })
	}

	try {
		return Response.json(
			await snapchainGet(
				snapchainPath,
				Object.fromEntries(
					[...url.searchParams.entries()].map(([key, value]) => [
						key,
						value,
					]),
				),
			),
		)
	} catch (error) {
		return new Response(
			error instanceof Error ? error.message : String(error),
			{ status: 502 },
		)
	}
}
