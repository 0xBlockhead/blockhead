// Generated from APP.ts.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import MevRelay_BuilderBlockReceivedSchema from '$/schema/MevRelay_BuilderBlockReceived.ts'
import { type as arktype } from 'arktype'

// Projection eligibility: facetPath=['Evm']
export const load: PageLoad = async ({ params, parent }) => {
	const parentData = await parent()

	if (!(
		(
			parentData.projectionNetwork.executionModels !== undefined
			&& parentData.projectionNetwork.executionModels.some((value: string | number | boolean | null) => value === 'Evm')
		)
		&& matchStringSegment(params.relayHost)
		&& matchNonNegativeInteger(params.slot)
		&& matchZeroExHex(params.blockHash)
		&& matchStringSegment(params.builderPubkey)
	))
		error(404, 'Route mapping not applicable')

	const mevRelayBuilderBlockReceivedEvmNetworkRelayHostSlotBlockHashBuilderPubkeySelector = parseEntitySelector(
		schema,
		MevRelay_BuilderBlockReceivedSchema,
		{
			$network: parentData.selector,
			relayHost: params.relayHost,
			slot: Number(params.slot),
			blockHash: params.blockHash,
			builderPubkey: params.builderPubkey,
		},
		'EvmNetworkRelayHostSlotBlockHashBuilderPubkey'
	)
	if (mevRelayBuilderBlockReceivedEvmNetworkRelayHostSlotBlockHashBuilderPubkeySelector instanceof arktype.errors)
		error(404, 'Invalid MevRelay_BuilderBlockReceived selector')

	return {
		selector: mevRelayBuilderBlockReceivedEvmNetworkRelayHostSlotBlockHashBuilderPubkeySelector,
	}
}
