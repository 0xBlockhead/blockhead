/**
 * Kingnodes dYdX Tendermint LCD wire shapes (fail-closed arktype envelopes).
 *
 * @see https://docs.cosmos.network/main/user-guides/grpc-rest#query-endpoints
 */

import { type as arktype } from 'arktype'


const naturalNumberString = arktype(/^(?:0|[1-9]\d*)$/)
const nonEmptyString = arktype('string > 0')

export const kingnodesDydxLatestBlockWire = arktype({
	block: {
		header: {
			chain_id: nonEmptyString,
			height: naturalNumberString,
			time: nonEmptyString,
		},
	},
})

export type KingnodesDydxLatestBlock = typeof kingnodesDydxLatestBlockWire.infer
