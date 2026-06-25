import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/BlockheadLogosBlockchainWalletKeyState_Timestamp.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$walletKeyState': {
				'$nodeState': {
					connectionId: decodeURIComponent(params.connectionId),
					peerId: decodeURIComponent(params.peerId),
				},
				publicKey: decodeURIComponent(params.publicKey),
			},
			timestampMs: Number(params.timestampMs),
			source: decodeURIComponent(params.source),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid BlockheadLogosBlockchainWalletKeyState_Timestamp selector')

	return { selector }
}
