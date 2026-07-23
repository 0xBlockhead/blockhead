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
	import CardanoTxOutputsView from '$/views/CardanoTxOutputsView.svelte'
	import UtxoOutputsView from '$/views/UtxoOutputsView.svelte'
</script>


<svelte:head>
	<title>Collections • Blockhead</title>
</svelte:head>


<Page>
	{#if data.entityType === EntityType.CardanoTransaction}
		{@const collection0Selection = select(EntityType.CardanoTransaction, data.selector)
			.$$outputs({
				sources: [
					Source.Blockfrost_Rest,
				],
			})}

		<CardanoTxOutputsView
			href={
				resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/outputs', {
					network: params.network,
					transactionId: params.transactionId,
				})
			}
			title='Cardano outputs'
			selection={collection0Selection}
			countResource={collection0Selection.count}
			id='outputs'
			data-column-item="flexible"
			data-card
			data-scroll-container
		/>
	{/if}

	{#if data.entityType === EntityType.UtxoTransaction}
		{@const collection1Selection = select(EntityType.UtxoTransaction, data.selector).$$outputs}

		<UtxoOutputsView
			href={
				resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/outputs', {
					network: params.network,
					transactionId: params.transactionId,
				})
			}
			title='UTXO outputs'
			selection={collection1Selection}
			countResource={collection1Selection.count}
			id='outputs'
			data-column-item="flexible"
			data-card
			data-scroll-container
		/>
	{/if}
</Page>
