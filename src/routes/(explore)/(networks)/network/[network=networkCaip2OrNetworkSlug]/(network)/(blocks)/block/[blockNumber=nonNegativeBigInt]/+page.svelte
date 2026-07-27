<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(
		(
			data.entityType === EntityType.EvmBlock && data.selectorName === 'EvmNetworkBlockNumber' ?
				select(EntityType.EvmBlock, data.selector, {
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
				})
			:
			data.entityType === EntityType.SolanaBlock && data.selectorName === 'Slot' ?
				select(EntityType.SolanaBlock, data.selector, {
					fields: {
						blockHeight: true,
						blockHash: true,
						previousBlockHash: true,
						parentSlot: true,
						timestampMs: true,
						transactionCount: true,
						$parent: true,
					},
				})
			:
			data.entityType === EntityType.UtxoBlock && data.selectorName === 'NetworkHeight' ?
				select(EntityType.UtxoBlock, data.selector, {
					fields: {
						transactionCount: true,
						hash: true,
						timestampMs: true,
						merkleRoot: true,
						nonce: true,
						difficulty: true,
						sizeBytes: true,
						weightUnits: true,
						$parent: true,
					},
				})
			:
				select(EntityType.PolkadotBlock, data.selector, {
					fields: {
						hash: true,
						stateRoot: true,
						extrinsicsRoot: true,
						$parent: true,
					},
				})
		)
	)
	const pageTitle = $derived(
		(
			data.entityType === EntityType.EvmBlock && data.selectorName === 'EvmNetworkBlockNumber' ?
				(pageSelection.entity == null ? (String(data.selector.blockNumber ?? '') ? 'Block #' + String(data.selector.blockNumber ?? '') : '') || String(data.selector.hash ?? '') || 'EVM block' : (String(data.selector.blockNumber ?? '') ? 'Block #' + String(data.selector.blockNumber ?? '') : '') || String(pageSelection.entity.hash ?? '') || 'EVM block')
			:
			data.entityType === EntityType.SolanaBlock && data.selectorName === 'Slot' ?
				((String(data.selector.slot ?? '') ? 'Slot #' + String(data.selector.slot ?? '') : '') || 'solana block')
			:
			data.entityType === EntityType.UtxoBlock && data.selectorName === 'NetworkHeight' ?
				(pageSelection.entity == null ? (String(data.selector.height ?? '') ? 'Block #' + String(data.selector.height ?? '') : '') || (data.selector.hash ?? '') || 'UTXO block' : (String(data.selector.height ?? '') ? 'Block #' + String(data.selector.height ?? '') : '') || (pageSelection.entity.hash ?? '') || 'UTXO block')
			:
				(pageSelection.entity == null ? (String(data.selector.blockNumber ?? '') ? 'Block #' + String(data.selector.blockNumber ?? '') : '') || (data.selector.hash ?? '') || 'Polkadot block' : (String(data.selector.blockNumber ?? '') ? 'Block #' + String(data.selector.blockNumber ?? '') : '') || (pageSelection.entity.hash ?? '') || 'Polkadot block')
		)
	)
	const entityViewByType = {
		[EntityType.EvmBlock]: {
			Component: EvmBlockView,
			label: 'EVM block',
		},
		[EntityType.SolanaBlock]: {
			Component: SolanaBlockView,
			label: 'solana block',
		},
		[EntityType.UtxoBlock]: {
			Component: UtxoBlockView,
			label: 'UTXO block',
		},
		[EntityType.PolkadotBlock]: {
			Component: PolkadotBlockView,
			label: 'Polkadot block',
		},
	}

	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
</script>


<svelte:head>
	<title>{pageTitle} • {entityViewByType[data.entityType].label} • Blockhead</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType].Component}

	<EntityView
		selection={pageSelection}
	/>
</Page>
