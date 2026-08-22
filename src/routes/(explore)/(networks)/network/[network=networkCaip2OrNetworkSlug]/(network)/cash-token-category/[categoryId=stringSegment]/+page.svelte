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

	const pageSelection = $derived(select(EntityType.BitcoinCashCashTokenCategory, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinCashCashTokenCategoryView from '$/views/BitcoinCashCashTokenCategoryView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.categoryId || 'Bitcoin Cash CashToken category')} • Bitcoin Cash CashToken category • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinCashCashTokenCategoryView
		selection={pageSelection}
	/>
</Page>
