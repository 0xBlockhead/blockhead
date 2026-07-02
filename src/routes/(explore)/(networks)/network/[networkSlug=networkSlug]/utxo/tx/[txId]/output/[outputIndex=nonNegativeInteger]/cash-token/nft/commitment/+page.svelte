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
	import BitcoinCashCashTokenCommitmentView from '$/views/BitcoinCashCashTokenCommitmentView.svelte'
</script>


<svelte:head>
	<title>Bitcoin Cash CashToken commitment • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinCashCashTokenCommitmentView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment', {
				networkSlug: params.networkSlug,
				txId: params.txId,
				outputIndex: params.outputIndex,
			})
		}
		selection={
			select(EntityType.BitcoinCashCashTokenCommitment, data.selector, {
				fields: {
					commitmentHex: true,
				},
			})
		}
	/>
</Page>
