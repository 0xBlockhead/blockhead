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

	const entityViewByType = {
		[EntityType.EvmTransaction]: EvmTransactionView,
		[EntityType.SolanaTransaction]: SolanaTransactionView,
		[EntityType.CardanoTransaction]: CardanoTransactionView,
		[EntityType.UtxoTransaction]: UtxoTransactionView,
		[EntityType.ArweaveTransaction]: ArweaveTransactionView,
	}

	// Components
	import Page from '$/components/Page.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
	import ArweaveTransactionView from '$/views/ArweaveTransactionView.svelte'
</script>


<svelte:head>
	<title>{
		(
			data.entityType === EntityType.EvmTransaction ?
				(data.selector.txHash || 'EVM transaction') + ' • EVM transaction • Blockhead'
			:
			data.entityType === EntityType.SolanaTransaction ?
				(data.selector.signature || 'solana transaction') + ' • solana transaction • Blockhead'
			:
			data.entityType === EntityType.CardanoTransaction ?
				(data.selector.hash || 'Cardano transaction') + ' • Cardano transaction • Blockhead'
			:
			data.entityType === EntityType.UtxoTransaction ?
				(data.selector.txId || 'UTXO transaction') + ' • UTXO transaction • Blockhead'
			:
				(data.selector.transactionId || 'arweave transaction') + ' • arweave transaction • Blockhead'
		)
	}</title>
</svelte:head>


<Page>
	{@const EntityView = entityViewByType[data.entityType]}

	<EntityView
		selection={
			data.entityType === EntityType.EvmTransaction ?
				select(EntityType.EvmTransaction, data.selector, {
					sources: [
						Source.Blockscout_Rest,
						Source.Voltaire_JsonRpc,
					],
				})
			:
			data.entityType === EntityType.SolanaTransaction ?
				select(EntityType.SolanaTransaction, data.selector)
			:
			data.entityType === EntityType.CardanoTransaction ?
				select(EntityType.CardanoTransaction, data.selector, {
					sources: [
						Source.Blockfrost_Rest,
						Source.CardanoKoios_Rest,
					],
				})
			:
			data.entityType === EntityType.UtxoTransaction ?
				select(EntityType.UtxoTransaction, data.selector)
			:
				select(EntityType.ArweaveTransaction, data.selector)
		}
	/>
</Page>
