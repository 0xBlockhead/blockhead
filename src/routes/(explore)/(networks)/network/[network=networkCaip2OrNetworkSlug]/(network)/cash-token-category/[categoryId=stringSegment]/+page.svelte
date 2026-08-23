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
	import BitcoinCashCashTokenCategoryView from '$/views/BitcoinCashCashTokenCategoryView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitcoinCashCashTokenCategory, data.selector))}
			<title>{data?.title ?? (pageSelection.entitySelector.categoryId || 'Bitcoin Cash CashToken category')} • Bitcoin Cash CashToken category • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Bitcoin Cash CashToken category'} • Bitcoin Cash CashToken category • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitcoinCashCashTokenCategory, data.selector))}

		<BitcoinCashCashTokenCategoryView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
