<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data.selectorMapping.entityType === EntityType.EvmBlock && data.selectorMapping.selectorName === 'EvmNetworkBlockNumber' ? select(EntityType.EvmBlock, data.selectorMapping.selector, {
		sources: [
			Source.SqdPortal_RawHttp,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			transactionCount: true,
			timestamp: true,
			gasUsed: true,
			gasLimit: true,
			baseFeePerGas: true,
			blobGasUsed: true,
			excessBlobGas: true,
			$parent: true,
			$miner: true,
		},
	}) : data.selectorMapping.entityType === EntityType.SolanaBlock && data.selectorMapping.selectorName === 'Slot' ? select(EntityType.SolanaBlock, data.selectorMapping.selector, {
		fields: {
			blockHeight: true,
			blockHash: true,
			previousBlockHash: true,
			parentSlot: true,
			timestampMs: true,
			transactionCount: true,
			$parent: true,
		},
	}) : data.selectorMapping.entityType === EntityType.UtxoBlock && data.selectorMapping.selectorName === 'NetworkHeight' ? select(EntityType.UtxoBlock, data.selectorMapping.selector, {
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
	}) : data.selectorMapping.entityType === EntityType.PolkadotBlock && data.selectorMapping.selectorName === 'NetworkBlockNumber' ? select(EntityType.PolkadotBlock, data.selectorMapping.selector, {
		fields: {
			stateRoot: true,
			extrinsicsRoot: true,
			$parent: true,
		},
	}) : undefined)
	const pageEntityTitle = $derived(data.selectorMapping.entityType === EntityType.EvmBlock && data.selectorMapping.selectorName === 'EvmNetworkBlockNumber' ? (pageSelection.entity == null ? (String((pageSelection.entitySelector.blockNumber) ?? '') ? 'Block #' + String((pageSelection.entitySelector.blockNumber) ?? '') : '') || [String((pageSelection.entitySelector.hash) ?? '')].filter(Boolean).join(' ') || 'EVM block' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).blockNumber) ?? '') ? 'Block #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).blockNumber) ?? '') : '') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'EVM block') : data.selectorMapping.entityType === EntityType.SolanaBlock && data.selectorMapping.selectorName === 'Slot' ? (pageSelection.entity == null ? (String((pageSelection.entitySelector.slot) ?? '') ? 'Slot #' + String((pageSelection.entitySelector.slot) ?? '') : '') || 'solana block' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).slot) ?? '') ? 'Slot #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).slot) ?? '') : '') || 'solana block') : data.selectorMapping.entityType === EntityType.UtxoBlock && data.selectorMapping.selectorName === 'NetworkHeight' ? (pageSelection.entity == null ? (String((pageSelection.entitySelector.height) ?? '') ? 'Block #' + String((pageSelection.entitySelector.height) ?? '') : '') || [String((pageSelection.entitySelector.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).height) ?? '') ? 'Block #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).height) ?? '') : '') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block') : data.selectorMapping.entityType === EntityType.PolkadotBlock && data.selectorMapping.selectorName === 'NetworkBlockNumber' ? (pageSelection.entity == null ? (String((pageSelection.entitySelector.blockNumber) ?? '') ? 'Block #' + String((pageSelection.entitySelector.blockNumber) ?? '') : '') || [String((pageSelection.entitySelector.hash) ?? '')].filter(Boolean).join(' ') || 'Polkadot block' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).blockNumber) ?? '') ? 'Block #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).blockNumber) ?? '') : '') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'Polkadot block') : 'Blockhead')
	const pageEntityTypeLabel = $derived(data.selectorMapping.entityType === EntityType.EvmBlock && data.selectorMapping.selectorName === 'EvmNetworkBlockNumber' ? 'EVM block' : data.selectorMapping.entityType === EntityType.SolanaBlock && data.selectorMapping.selectorName === 'Slot' ? 'solana block' : data.selectorMapping.entityType === EntityType.UtxoBlock && data.selectorMapping.selectorName === 'NetworkHeight' ? 'UTXO block' : data.selectorMapping.entityType === EntityType.PolkadotBlock && data.selectorMapping.selectorName === 'NetworkBlockNumber' ? 'Polkadot block' : 'Entity')

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
			resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
				network: params.network,
				blockNumber: params.blockNumber,
			})
		}
		selection={pageSelection}
	/>
</Page>
