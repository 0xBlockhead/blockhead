<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandTransactionView from '$/views/AlgorandTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandTransaction, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.txId || 'algorand transaction')} • algorand transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'algorand transaction'} • algorand transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.AlgorandTransaction, data.selector)}

	<AlgorandTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
