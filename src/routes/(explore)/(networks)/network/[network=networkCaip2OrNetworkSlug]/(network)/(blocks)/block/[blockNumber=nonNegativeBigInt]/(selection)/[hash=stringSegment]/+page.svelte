<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data.selectorMapping.entityType === EntityType.PolkadotBlock && data.selectorMapping.selectorName === 'NetworkBlockNumberHash' ? select(EntityType.PolkadotBlock, data.selectorMapping.selector, {
		fields: {
			stateRoot: true,
			extrinsicsRoot: true,
			$parent: true,
		},
	}) : data.selectorMapping.entityType === EntityType.UtxoBlock && data.selectorMapping.selectorName === 'NetworkHeightHash' ? select(EntityType.UtxoBlock, data.selectorMapping.selector, {
		fields: {
			transactionCount: true,
			timestampMs: true,
			merkleRoot: true,
			nonce: true,
			difficulty: true,
			sizeBytes: true,
			weightUnits: true,
			$parent: true,
		},
	}) : undefined)
	const pageEntityTitle = $derived(data.selectorMapping.entityType === EntityType.PolkadotBlock && data.selectorMapping.selectorName === 'NetworkBlockNumberHash' ? (pageSelection.entity == null ? (String((pageSelection.entitySelector.blockNumber) ?? '') ? 'Block #' + String((pageSelection.entitySelector.blockNumber) ?? '') : '') || [String((pageSelection.entitySelector.hash) ?? '')].filter(Boolean).join(' ') || 'Polkadot block' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).blockNumber) ?? '') ? 'Block #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).blockNumber) ?? '') : '') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'Polkadot block') : data.selectorMapping.entityType === EntityType.UtxoBlock && data.selectorMapping.selectorName === 'NetworkHeightHash' ? (pageSelection.entity == null ? (String((pageSelection.entitySelector.height) ?? '') ? 'Block #' + String((pageSelection.entitySelector.height) ?? '') : '') || [String((pageSelection.entitySelector.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).height) ?? '') ? 'Block #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).height) ?? '') : '') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block') : 'Blockhead')
	const pageEntityTypeLabel = $derived(data.selectorMapping.entityType === EntityType.PolkadotBlock && data.selectorMapping.selectorName === 'NetworkBlockNumberHash' ? 'Polkadot block' : data.selectorMapping.entityType === EntityType.UtxoBlock && data.selectorMapping.selectorName === 'NetworkHeightHash' ? 'UTXO block' : 'Entity')

	// Components
	import Page from '$/components/Page.svelte'
	import { entityViewComponentByType } from '$/views/index.ts'
</script>


<svelte:head>
	<title>{pageEntityTitle} • {pageEntityTypeLabel} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.selectorMapping.entityType]}

	<EntityView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
				network: params.network,
				blockNumber: params.blockNumber,
				hash: params.hash,
			})
		}
		selection={pageSelection}
	/>
</Page>
