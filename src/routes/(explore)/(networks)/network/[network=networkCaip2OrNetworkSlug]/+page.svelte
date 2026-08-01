<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { consensusProtocolByProtocol } from '$/constants/EvmNetwork.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(
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
				Evm: {
					fields: {
						consensusProtocol: true,
						registryStatus: true,
						shortName: true,
						peeringId: true,
						slip44: true,
						$nativeCoinInstance: true,
						$nativeCoin: true,
						$parent: true,
						$mainnet: true,
					},
				},
				ZeroG: {
					fields: {
						chainId: true,
					},
				},
				Lightning: {
					fields: {
						$settlementNetwork: true,
					},
				},
				Hedera: {
					fields: {
						shard: true,
						realm: true,
					},
				},
				caip2: true,
			},
		})
	)
	const pageTitle = $derived(
		(
			data.entityType === EntityType.Network && data.selectorName === 'Caip2' ?
				pageSelection.entity == null ? (data.selector.caip2 == null ? '' : `${data.selector.caip2.namespace}:${data.selector.caip2.reference}`) || 'Network' : pageSelection.entity.name || (data.selector.caip2 == null ? '' : `${data.selector.caip2.namespace}:${data.selector.caip2.reference}`) || 'Network'
			:
				pageSelection.entity == null ? 'Network' : pageSelection.entity.name || (pageSelection.entity.caip2 == null ? '' : `${pageSelection.entity.caip2.namespace}:${pageSelection.entity.caip2.reference}`) || 'Network'
		)
	)

	// Components
	import Page from '$/components/Page.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<svelte:head>
	<title>{pageTitle} • Network • Blockhead</title>
</svelte:head>


<Page>
	<NetworkView
		selection={pageSelection}
	/>
</Page>
