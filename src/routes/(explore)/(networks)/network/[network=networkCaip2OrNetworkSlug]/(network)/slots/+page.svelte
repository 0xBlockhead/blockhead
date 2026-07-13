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
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
</script>


<svelte:head>
	<title>Beacon slots • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<BeaconSlotsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/slots', {
						network: params.network,
					})
				}
				title='Beacon slots'
				selection={
					projection.$$beaconSlots({
						sources: [
							Source.Beacon_Rest,
						],
					})
				}
				id='beacon-slots'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
