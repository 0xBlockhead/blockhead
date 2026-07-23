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

	const pageSelection = $derived(data.entityType === EntityType.EvmBlock && data.selectorName === 'EvmNetworkBlockNumber' ? select(EntityType.EvmBlock, data.selector, {
		sources: [
			Source.SqdPortal_RawHttp,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			hash: true,
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
	}) : data.entityType === EntityType.SolanaBlock && data.selectorName === 'Slot' ? select(EntityType.SolanaBlock, data.selector, {
		fields: {
			blockHeight: true,
			blockHash: true,
			previousBlockHash: true,
			parentSlot: true,
			timestampMs: true,
			transactionCount: true,
			$parent: true,
		},
	}) : data.entityType === EntityType.UtxoBlock && data.selectorName === 'NetworkHeight' ? select(EntityType.UtxoBlock, data.selector, {
		fields: {
			hash: true,
			transactionCount: true,
			timestampMs: true,
			merkleRoot: true,
			nonce: true,
			difficulty: true,
			sizeBytes: true,
			weightUnits: true,
			$parent: true,
		},
	}) : select(EntityType.PolkadotBlock, data.selector, {
		fields: {
			hash: true,
			stateRoot: true,
			extrinsicsRoot: true,
			$parent: true,
		},
	}))
	const entityViewComponentByType = {
		[EntityType.EvmBlock]: EvmBlockView,
		[EntityType.SolanaBlock]: SolanaBlockView,
		[EntityType.UtxoBlock]: UtxoBlockView,
		[EntityType.PolkadotBlock]: PolkadotBlockView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
</script>


<svelte:head>
	<title>{data.entityType === EntityType.EvmBlock && data.selectorName === 'EvmNetworkBlockNumber' ? (pageSelection.entity == null ? (String((data.selector.blockNumber) ?? '') ? 'Block #' + String((data.selector.blockNumber) ?? '') : '') || [String((data.selector.hash) ?? '')].filter(Boolean).join(' ') || 'EVM block' : (String((({ ...data.selector, ...pageSelection.entity }).blockNumber) ?? '') ? 'Block #' + String((({ ...data.selector, ...pageSelection.entity }).blockNumber) ?? '') : '') || [String((({ ...data.selector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'EVM block') : data.entityType === EntityType.SolanaBlock && data.selectorName === 'Slot' ? (pageSelection.entity == null ? (String((data.selector.slot) ?? '') ? 'Slot #' + String((data.selector.slot) ?? '') : '') || 'solana block' : (String((({ ...data.selector, ...pageSelection.entity }).slot) ?? '') ? 'Slot #' + String((({ ...data.selector, ...pageSelection.entity }).slot) ?? '') : '') || 'solana block') : data.entityType === EntityType.UtxoBlock && data.selectorName === 'NetworkHeight' ? (pageSelection.entity == null ? (String((data.selector.height) ?? '') ? 'Block #' + String((data.selector.height) ?? '') : '') || [String((data.selector.hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block' : (String((({ ...data.selector, ...pageSelection.entity }).height) ?? '') ? 'Block #' + String((({ ...data.selector, ...pageSelection.entity }).height) ?? '') : '') || [String((({ ...data.selector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'UTXO block') : (pageSelection.entity == null ? (String((data.selector.blockNumber) ?? '') ? 'Block #' + String((data.selector.blockNumber) ?? '') : '') || [String((data.selector.hash) ?? '')].filter(Boolean).join(' ') || 'Polkadot block' : (String((({ ...data.selector, ...pageSelection.entity }).blockNumber) ?? '') ? 'Block #' + String((({ ...data.selector, ...pageSelection.entity }).blockNumber) ?? '') : '') || [String((({ ...data.selector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'Polkadot block')} • {data.entityType === EntityType.EvmBlock && data.selectorName === 'EvmNetworkBlockNumber' ? 'EVM block' : data.entityType === EntityType.SolanaBlock && data.selectorName === 'Slot' ? 'solana block' : data.entityType === EntityType.UtxoBlock && data.selectorName === 'NetworkHeight' ? 'UTXO block' : 'Polkadot block'} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewComponentByType[data.entityType]}

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
