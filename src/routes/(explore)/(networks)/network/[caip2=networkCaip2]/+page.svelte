<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<Page>
	<NetworkView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
				caip2: params.caip2,
			})
		}
		selection={
			select(EntityType.Network, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					$icon: true,
					name: true,
					namespace: true,
					ledgerModels: true,
					executionModels: true,
					$networkStack: true,
					environment: true,
					evmConsensusProtocol: true,
					evmRegistryStatus: true,
					evmPeeringId: true,
					evmSlip44: true,
					zeroGChainId: true,
					$lightningSettlementNetwork: true,
				},
			})
		}
	/>
</Page>
