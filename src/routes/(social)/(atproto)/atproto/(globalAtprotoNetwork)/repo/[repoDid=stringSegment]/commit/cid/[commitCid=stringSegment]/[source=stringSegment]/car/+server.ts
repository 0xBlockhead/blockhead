import { error } from '@sveltejs/kit'

import type { RequestHandler } from './$types.ts'
import { getCurrentPdsOrigin } from '$/sources/AtprotoSync/Xrpc/identity.ts'
import { getBlocks } from '$/sources/AtprotoSync/Xrpc/queries.ts'
import { atprotoCidString } from '$/sources/AtprotoSync/Xrpc/cid.ts'
import { Source } from '$/sources/Source.ts'


export const GET: RequestHandler = async ({ params, request }) => {
	if (params.source !== Source.AtprotoSync_Xrpc)
		error(404, 'This CAR export is only available from AT Protocol sync')

	const canonicalCommitCid = atprotoCidString(params.commitCid)
	if (canonicalCommitCid == null || canonicalCommitCid !== params.commitCid)
		error(400, 'commitCid must be a canonical CID')

	const serviceOrigin = await getCurrentPdsOrigin({
		did: params.repoDid,
		signal: request.signal,
	})
	const car = await getBlocks({
		serviceOrigin,
		did: params.repoDid,
		cids: [params.commitCid],
		signal: request.signal,
	})

	return new Response(car, {
		headers: {
			'content-type': 'application/vnd.ipld.car',
			'content-disposition': `attachment; filename="atproto-repo-commit-${params.commitCid}.car"`,
		},
	})
}
