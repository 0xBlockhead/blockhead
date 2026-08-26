<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()
	const collectionHref = $derived(
		resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/outputs',
			{
				network: params.network,
				transactionId: params.transactionId,
			}
		)
	)


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
		{@const collection0Selection = select(EntityType.CardanoTransaction, data.selector).$$outputs}

		<CardanoTxOutputsView
			href={collectionHref}
			title='Cardano outputs'
			selection={collection0Selection}
			countResource={collection0Selection.count}
			id='outputs'
		/>
	{/if}

	{#if data.entityType === EntityType.UtxoTransaction}
		{@const collection1Selection = select(EntityType.UtxoTransaction, data.selector).$$outputs}

		<UtxoOutputsView
			href={collectionHref}
			selection={collection1Selection}
			countResource={collection1Selection.count}
			id='outputs'
		/>
	{/if}
</Page>
