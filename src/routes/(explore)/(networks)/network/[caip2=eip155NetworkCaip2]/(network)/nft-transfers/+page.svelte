<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
</script>


<svelte:head>
	<title>NFT transfers • Blockhead</title>
</svelte:head>


<Page>
	<EvmTokenTransfersView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/nft-transfers', {
				caip2: params.caip2,
			})
		}
		title='NFT transfers'
		selection={
			select(EntityType.Network, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			}).Evm.$$nftTokenTransfers({
				sources: [
					Source.Blockscout_Rest,
				],
			})
		}
		id='nft-token-transfers'
	/>
</Page>
