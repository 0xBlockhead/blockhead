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
	import EvmNetwork_GasEstimate_TimestampsView from '$/views/EvmNetwork_GasEstimate_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Gas estimates • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<EvmNetwork_GasEstimate_TimestampsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/gas-estimates', {
						network: params.network,
					})
				}
				title='Gas estimates'
				selection={
					projection.$$gasEstimateTimestamps({
						sources: [
							Source.Blockscout_Rest,
							Source.Etherscan_Rest,
						],
						count: true,
					})
				}
				id='gas-estimate-timestamps'
				data-column-item="flexible"
				data-card
				data-scroll-container
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
