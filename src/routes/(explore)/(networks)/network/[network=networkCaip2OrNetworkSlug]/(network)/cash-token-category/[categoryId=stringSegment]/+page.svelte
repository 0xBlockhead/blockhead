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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitcoinCashCashTokenCategory, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinCashCashTokenCategoryView from '$/views/BitcoinCashCashTokenCategoryView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.categoryId || 'Bitcoin Cash CashToken category')} • Bitcoin Cash CashToken category • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Bitcoin Cash CashToken category'} • Bitcoin Cash CashToken category • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitcoinCashCashTokenCategoryView
		selection={pageSelection}
	/>
	{/if}
</Page>
