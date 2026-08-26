<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.SuiCoinType, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import SuiCoinTypeView from '$/views/SuiCoinTypeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.coinType || 'Sui coin type')} • Sui coin type • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Sui coin type'} • Sui coin type • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<SuiCoinTypeView
		selection={pageSelection}
	/>
	{/if}
</Page>
