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
	import BeaconAttestationsView from '$/views/BeaconAttestationsView.svelte'
</script>


<svelte:head>
	<title>Beacon attestations • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<BeaconAttestationsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/attestations', {
						network: params.network,
					})
				}
				title='Beacon attestations'
				selection={
					projection.$$beaconAttestations({
						sources: [
							Source.Beacon_Rest,
						],
					})
				}
				id='beacon-attestations'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
