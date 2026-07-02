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
	import BitcoinCashCashTokenFungibleAmountView from '$/views/BitcoinCashCashTokenFungibleAmountView.svelte'
</script>


<svelte:head>
	<title>Bitcoin Cash CashToken fungible amount • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinCashCashTokenFungibleAmountView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/fungible-amount', {
				networkSlug: params.networkSlug,
				txId: params.txId,
				outputIndex: params.outputIndex,
			})
		}
		selection={
			select(EntityType.BitcoinCashCashTokenFungibleAmount, data.selector, {
				fields: {
					amount: true,
					$category: true,
				},
			})
		}
	/>
</Page>
