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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AvalanchePChainTransaction, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import AvalanchePChainTransactionView from '$/views/AvalanchePChainTransactionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.txId || 'avalanche p chain transaction')} • avalanche p chain transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'avalanche p chain transaction'} • avalanche p chain transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AvalanchePChainTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
