<!-- Generated from APP.ts. -->

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
	const collectionHref = $derived(
		resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/inputs',
			{
				network: params.network,
				transactionId: params.transactionId,
			}
		)
	)


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
			href={collectionHref}
			title='Cardano inputs'
			selection={collection0Selection}
			countResource={collection0Selection.count}
			id='inputs'
		/>
	{/if}

	{#if data.entityType === EntityType.UtxoTransaction}
		{@const collection1Selection = select(EntityType.UtxoTransaction, data.selector).$$inputs}

		<UtxoInputsView
			href={collectionHref}
			selection={collection1Selection}
			countResource={collection1Selection.count}
			id='inputs'
		/>
	{/if}
</Page>
