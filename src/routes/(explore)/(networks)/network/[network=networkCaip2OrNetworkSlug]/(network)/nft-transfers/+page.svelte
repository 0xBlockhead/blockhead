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


	// Components
	import Page from '$/components/Page.svelte'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
</script>


<svelte:head>
	<title>NFT transfers • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<EvmTokenTransfersView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/nft-transfers', {
						network: params.network,
					})
				}
				title='NFT transfers'
				selection={
					projection.$$nftTokenTransfers({
						sources: [
							Source.Blockscout_Rest,
						],
						count: true,
					})
				}
				id='nft-token-transfers'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
