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
	import EthereumBeaconFinality_TimestampsView from '$/views/EthereumBeaconFinality_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Beacon finality • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<EthereumBeaconFinality_TimestampsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/finality', {
						network: params.network,
					})
				}
				title='Beacon finality'
				selection={
					projection.$$beaconFinalityTimestamps({
						sources: [
							Source.Beacon_Rest,
						],
					})
				}
				id='beacon-finality-timestamps'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
