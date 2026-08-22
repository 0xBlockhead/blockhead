<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BitcoinCashCashTokenFungibleAmount, {
		$output: data.selector,
	}, {
		sources: [
			Source.BitcoinCashNode_JsonRpc,
		],
		fields: {
			amount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinCashCashTokenFungibleAmountView from '$/views/BitcoinCashCashTokenFungibleAmountView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Bitcoin Cash CashToken fungible amount' : String(pageSelection.entity.amount) || 'Bitcoin Cash CashToken fungible amount')} • Bitcoin Cash CashToken fungible amount • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinCashCashTokenFungibleAmountView
		selection={pageSelection}
	/>
</Page>
