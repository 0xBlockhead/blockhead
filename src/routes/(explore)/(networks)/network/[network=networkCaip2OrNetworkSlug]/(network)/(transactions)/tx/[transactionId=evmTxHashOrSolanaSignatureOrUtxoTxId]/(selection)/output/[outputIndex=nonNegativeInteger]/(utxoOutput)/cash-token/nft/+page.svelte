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

	const pageSelection = $derived(select(EntityType.BitcoinCashCashTokenNft, data.selector, {
		sources: [
			Source.BitcoinCashNode_JsonRpc,
		],
		fields: {
			capability: true,
			$category: true,
			$commitment: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.capability) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken NFT' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).capability) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken NFT')))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinCashCashTokenNftView from '$/views/BitcoinCashCashTokenNftView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Bitcoin Cash CashToken NFT • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinCashCashTokenNftView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft', {
				network: params.network,
				transactionId: params.transactionId,
				outputIndex: params.outputIndex,
			})
		}
		selection={pageSelection}
	/>
</Page>
