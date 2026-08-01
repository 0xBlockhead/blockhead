<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
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
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-transfers',
				{
					network: params.network,
				}
			)
		}
		title='NFT transfers'
		selection={select(EntityType.Network, data.selector).Evm.$$nftTokenTransfers}
		id='nft-token-transfers'
	/>
</Page>
