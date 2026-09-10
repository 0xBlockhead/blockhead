import { error, json } from '@sveltejs/kit'

import type { RequestHandler } from './$types.ts'
import { getBlocks } from '$/sources/AtprotoSync/Xrpc/queries.ts'
import { getCurrentPdsOrigin } from '$/sources/AtprotoSync/Xrpc/identity.ts'
import { projectAtprotoRepoCommitBlock } from '$/sources/AtprotoSync/Xrpc/commit.ts'
import { Source } from '$/sources/Source.ts'


export const GET: RequestHandler = async ({ params, request }) => {
	if (params.source !== Source.AtprotoSync_Xrpc)
		error(404, 'This CAR manifest is only available from AT Protocol sync')

	const serviceOrigin = await getCurrentPdsOrigin({
		did: params.repoDid,
		signal: request.signal,
	})
	const commit = await projectAtprotoRepoCommitBlock({
		car: await getBlocks({
			serviceOrigin,
			did: params.repoDid,
			cids: [params.commitCid],
			signal: request.signal,
		}),
		repoDid: params.repoDid,
		commitCid: params.commitCid,
	})

	return json({
		format: 'atproto-repo-commit-car-manifest/v1',
		artifact: 'decoded-car-commit-manifest',
		provenance: {
			source: Source.AtprotoSync_Xrpc,
			serviceOrigin,
		},
		request: {
			repoDid: params.repoDid,
			commitCid: params.commitCid,
		},
		verification: {
			carRootCid: params.commitCid,
			commitCidDigest: 'verified',
		},
		commit,
		originalCar: {
			included: false,
			reason: 'The manifest exposes verified decoded commit metadata; it does not redistribute the source CAR bytes.',
		},
	}, {
		headers: {
			'content-disposition': 'attachment; filename="atproto-repo-commit-car-manifest.json"',
		},
	})
}
