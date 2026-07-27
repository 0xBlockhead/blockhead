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


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoTxInputsView from '$/views/CardanoTxInputsView.svelte'
	import UtxoInputsView from '$/views/UtxoInputsView.svelte'
</script>


<svelte:head>
	<title>Collections • Blockhead</title>
</svelte:head>


<Page>
	{#if data.entityType === EntityType.CardanoTransaction}
		{@const collection0Selection = select(EntityType.CardanoTransaction, data.selector).$$inputs}

		<CardanoTxInputsView
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/inputs',
					{
						network: String(params.network),
						transactionId: String(params.transactionId),
					}
				)
			}
			title='Cardano inputs'
			selection={collection0Selection}
			countResource={collection0Selection.count}
			id='inputs'
			data-column-item="flexible"
			data-card
			data-scroll-container
		/>
	{/if}

	{#if data.entityType === EntityType.UtxoTransaction}
		{@const collection1Selection = select(EntityType.UtxoTransaction, data.selector).$$inputs}

		<UtxoInputsView
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/inputs',
					{
						network: String(params.network),
						transactionId: String(params.transactionId),
					}
				)
			}
			title='UTXO inputs'
			selection={collection1Selection}
			countResource={collection1Selection.count}
			id='inputs'
			data-column-item="flexible"
			data-card
			data-scroll-container
		/>
	{/if}
</Page>
