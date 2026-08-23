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
	import SuiCoinTypeView from '$/views/SuiCoinTypeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiCoinType, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.coinType || 'Sui coin type')} • Sui coin type • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui coin type'} • Sui coin type • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SuiCoinType, data.selector)}

	<SuiCoinTypeView
		selection={pageSelection}
	/>
	{/if}
</Page>
