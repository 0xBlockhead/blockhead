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
	<title>ERC-20 transfers • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<EvmTokenTransfersView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-20-transfers', {
						network: params.network,
					})
				}
				title='ERC-20 transfers'
				selection={
					projection
						.$$erc20TokenTransfers({
							sources: [
								Source.Blockscout_Rest,
							],
						})
				}
				id='account-evm-token-transfer'
				data-column-item="flexible"
				data-card
				data-scroll-container
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
