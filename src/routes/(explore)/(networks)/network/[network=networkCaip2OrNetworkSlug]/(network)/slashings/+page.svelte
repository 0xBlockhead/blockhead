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
	import BeaconSlashingsView from '$/views/BeaconSlashingsView.svelte'
</script>


<svelte:head>
	<title>Beacon slashings • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<BeaconSlashingsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/slashings', {
						network: params.network,
					})
				}
				title='Beacon slashings'
				selection={
					projection.$$beaconSlashings({
						sources: [
							Source.Beacon_Rest,
						],
						count: true,
					})
				}
				id='beacon-slashings'
				data-column-item="flexible"
				data-card
				data-scroll-container
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
