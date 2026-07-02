<!-- Generated from APP.ts. Do not edit by hand. -->

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


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinCashCashTokenCategoryView from '$/views/BitcoinCashCashTokenCategoryView.svelte'
</script>


<svelte:head>
	<title>Bitcoin Cash CashToken category • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinCashCashTokenCategoryView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/cash-token/category/[categoryId]', {
				networkSlug: params.networkSlug,
				categoryId: params.categoryId,
			})
		}
		selection={select(EntityType.BitcoinCashCashTokenCategory, data.selector)}
	/>
</Page>
