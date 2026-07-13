<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BitcoinCashCashTokenFungibleAmount, data.selector, {
		sources: [
			Source.BitcoinCashNode_JsonRpc,
		],
		fields: {
			amount: true,
			$category: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.amount) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken fungible amount' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).amount) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken fungible amount')))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinCashCashTokenFungibleAmountView from '$/views/BitcoinCashCashTokenFungibleAmountView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Bitcoin Cash CashToken fungible amount • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinCashCashTokenFungibleAmountView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/fungible-amount', {
				network: params.network,
				transactionId: params.transactionId,
				outputIndex: params.outputIndex,
			})
		}
		selection={pageSelection}
	/>
</Page>
