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

	const pageSelection = $derived(data.entityType === EntityType.PolkadotBlock && data.selectorName === 'NetworkBlockNumberHash' ? select(EntityType.PolkadotBlock, data.selector, {
		fields: {
			stateRoot: true,
			extrinsicsRoot: true,
			$parent: true,
		},
	}) : select(EntityType.UtxoBlock, data.selector, {
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
	}))
	const entityViewComponentByType = {
		[EntityType.PolkadotBlock]: PolkadotBlockView,
		[EntityType.UtxoBlock]: UtxoBlockView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
</script>


<svelte:head>
	<title>{data.entityType === EntityType.PolkadotBlock && data.selectorName === 'NetworkBlockNumberHash' ? (pageSelection.entity == null ? (String((data.selector.blockNumber) ?? '') ? 'Block #' + String((data.selector.blockNumber) ?? '') : '') || [String((data.selector.hash) ?? '')].filter(Boolean).join(' ') || 'Polkadot block' : (String((({ ...data.selector, ...pageSelection.entity }).blockNumber) ?? '') ? 'Block #' + String((({ ...data.selector, ...pageSelection.entity }).blockNumber) ?? '') : '') || [String((({ ...data.selector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'Polkadot block') : (pageSelection.entity == null ? (String((data.selector.height) ?? '') ? 'Block #' + String((data.selector.height) ?? '') : '') || [String((data.selector.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block' : (String((({ ...data.selector, ...pageSelection.entity }).height) ?? '') ? 'Block #' + String((({ ...data.selector, ...pageSelection.entity }).height) ?? '') : '') || [String((({ ...data.selector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block')} • {data.entityType === EntityType.PolkadotBlock && data.selectorName === 'NetworkBlockNumberHash' ? 'Polkadot block' : 'UTXO block'} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.entityType]}

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
