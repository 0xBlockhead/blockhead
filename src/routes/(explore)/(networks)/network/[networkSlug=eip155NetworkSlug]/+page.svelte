<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<Page>
	<NetworkView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
				networkSlug: params.networkSlug,
			})
		}
		selection={
			select(EntityType.Network, data.selector, {
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
