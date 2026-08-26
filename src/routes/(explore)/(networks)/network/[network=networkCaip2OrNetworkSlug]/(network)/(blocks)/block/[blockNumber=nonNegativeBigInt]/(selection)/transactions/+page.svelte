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
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/transactions',
			{
				network: params.network,
				blockNumber: params.blockNumber,
			}
		)
	)


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import SolanaTransactionsView from '$/views/SolanaTransactionsView.svelte'
	import UtxoTransactionsView from '$/views/UtxoTransactionsView.svelte'
</script>


<svelte:head>
	<title>Block transactions • Blockhead</title>
</svelte:head>


<Page>
	{#if data.entityType === EntityType.EvmBlock}
		{@const collection0Selection = select(EntityType.EvmBlock, data.selector).$$transactions}

		<EvmTransactionsView
			href={collectionHref}
			title='Block transactions'
			selection={collection0Selection}
			countResource={collection0Selection.count}
			id='transactions'
		/>
	{/if}

	{#if data.entityType === EntityType.SolanaBlock}
		{@const collection1Selection = select(EntityType.SolanaBlock, data.selector).$$transactions}

		<SolanaTransactionsView
			href={collectionHref}
			title='Block transactions'
			selection={collection1Selection}
			countResource={collection1Selection.count}
			id='transactions'
		/>
	{/if}

	{#if data.entityType === EntityType.UtxoBlock}
		{@const collection2Selection = select(EntityType.UtxoBlock, data.selector).$$transactions}

		<UtxoTransactionsView
			href={collectionHref}
			title='Block transactions'
			selection={collection2Selection}
			countResource={collection2Selection.count}
			id='transactions'
		/>
	{/if}
</Page>
