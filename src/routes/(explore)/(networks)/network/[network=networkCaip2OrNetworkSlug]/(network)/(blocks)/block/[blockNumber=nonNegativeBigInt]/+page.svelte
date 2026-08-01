<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(
		(
			data.entityType === EntityType.EvmBlock ?
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
			data.entityType === EntityType.SolanaBlock ?
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
			data.entityType === EntityType.UtxoBlock ?
				select(EntityType.UtxoBlock, data.selector, {
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
	const documentTitle = $derived(
		(
			data.entityType === EntityType.EvmBlock ?
				(pageSelection.entity == null ? `Block #${data.selector.blockNumber}` : (String(data.selector.blockNumber ?? '') ? 'Block #' + String(data.selector.blockNumber ?? '') : '') || (pageSelection.entity.hash ?? '') || 'EVM block') + ' • EVM block • Blockhead'
			:
			data.entityType === EntityType.SolanaBlock ?
				((String(data.selector.slot ?? '') ? 'Slot #' + String(data.selector.slot ?? '') : '') || 'solana block') + ' • solana block • Blockhead'
			:
			data.entityType === EntityType.UtxoBlock ?
				(pageSelection.entity == null ? `Block #${data.selector.height}` : (String(data.selector.height ?? '') ? 'Block #' + String(data.selector.height ?? '') : '') || (pageSelection.entity.hash ?? '') || 'UTXO block') + ' • UTXO block • Blockhead'
			:
				(pageSelection.entity == null ? `Block #${data.selector.blockNumber}` : (String(data.selector.blockNumber ?? '') ? 'Block #' + String(data.selector.blockNumber ?? '') : '') || (pageSelection.entity.hash ?? '') || 'Polkadot block') + ' • Polkadot block • Blockhead'
		)
	)
	const entityViewByType = {
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
	<title>{documentTitle}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={pageSelection}
	/>
</Page>
