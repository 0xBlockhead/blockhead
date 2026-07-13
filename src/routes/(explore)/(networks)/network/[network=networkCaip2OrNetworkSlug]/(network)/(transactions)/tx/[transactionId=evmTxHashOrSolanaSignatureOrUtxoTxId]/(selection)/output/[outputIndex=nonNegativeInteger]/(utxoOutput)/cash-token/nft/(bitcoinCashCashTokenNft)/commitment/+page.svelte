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

	const pageSelection = $derived(select(EntityType.BitcoinCashCashTokenCommitment, {
		$output: data.selector.$output,
	}, {
		sources: [
			Source.BitcoinCashNode_JsonRpc,
		],
		fields: {
			commitmentHex: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.commitmentHex) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken commitment' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).commitmentHex) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken commitment')))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinCashCashTokenCommitmentView from '$/views/BitcoinCashCashTokenCommitmentView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Bitcoin Cash CashToken commitment • Blockhead</title>
</svelte:head>


<Page>
	<BitcoinCashCashTokenCommitmentView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment', {
				network: params.network,
				transactionId: params.transactionId,
				outputIndex: params.outputIndex,
			})
		}
		selection={pageSelection}
	/>
</Page>
