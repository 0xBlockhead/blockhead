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
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<svelte:head>
	<title>UTXO output • Blockhead</title>
</svelte:head>


<Page>
	<UtxoOutputView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]', {
				networkSlug: params.networkSlug,
				txId: params.txId,
				outputIndex: params.outputIndex,
			})
		}
		selection={
			select(EntityType.UtxoOutput, data.selector, {
				fields: {
					$address: true,
					isSpent: true,
					valueSats: true,
					scriptPubKeyType: true,
					isConfidential: true,
					scriptPubKeyAsm: true,
					scriptPubKeyHex: true,
					assetCommitment: true,
					valueCommitment: true,
					nonceCommitment: true,
					surjectionProof: true,
					rangeProof: true,
					$bitcoinCashCashTokenFungibleAmount: true,
					$bitcoinCashCashTokenNft: true,
				},
			})
		}
	/>
</Page>
