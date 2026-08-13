import { error, json } from '@sveltejs/kit'

import type { RequestHandler } from './$types.ts'
import {
	defaultAtprotoSyncRelayOrigin,
	getBlocks,
} from '$/sources/AtprotoSync/Xrpc/queries.ts'
import { projectAtprotoRepoCommitBlock } from '$/sources/AtprotoSync/Xrpc/commit.ts'
import { Source } from '$/sources/Source.ts'


export const GET: RequestHandler = async ({ params }) => {
	if (params.source !== Source.AtprotoSync_Xrpc)
		error(404, 'This CAR manifest is only available from AT Protocol sync')

	const commit = await projectAtprotoRepoCommitBlock({
		car: await getBlocks({
			serviceOrigin: defaultAtprotoSyncRelayOrigin,
			did: params.repoDid,
			cids: [params.commitCid],
		}),
		repoDid: params.repoDid,
		commitCid: params.commitCid,
	})

	return json({
		format: 'atproto-repo-commit-car-manifest/v1',
		artifact: 'decoded-car-commit-manifest',
		provenance: {
			source: Source.AtprotoSync_Xrpc,
			serviceOrigin: defaultAtprotoSyncRelayOrigin,
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
