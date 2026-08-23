<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import AvalanchePChainTransactionView from '$/views/AvalanchePChainTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AvalanchePChainTransaction, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.txId || 'avalanche p chain transaction')} • avalanche p chain transaction • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'avalanche p chain transaction'} • avalanche p chain transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.AvalanchePChainTransaction, data.selector))}

		<AvalanchePChainTransactionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
