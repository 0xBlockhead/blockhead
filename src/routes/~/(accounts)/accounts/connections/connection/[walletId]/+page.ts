import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import BlockheadWalletConnectionSchema from '$/schema/BlockheadWalletConnection.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const entityId = BlockheadWalletConnectionSchema.id({
		$wallet: {
			id: decodeURIComponent(params.walletId),
		},
	})
	if (entityId instanceof arktype.errors) error(404, 'Invalid wallet connection')

	return { entityId }
}
