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
	import BeaconSyncCommitteesView from '$/views/BeaconSyncCommitteesView.svelte'
</script>


<svelte:head>
	<title>Beacon sync committees • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<BeaconSyncCommitteesView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/sync-committees', {
						network: params.network,
					})
				}
				title='Beacon sync committees'
				selection={
					projection.$$beaconSyncCommittees({
						sources: [
							Source.Beacon_Rest,
						],
						count: true,
					})
				}
				id='beacon-sync-committees'
				data-column-item="flexible"
				data-card
				data-scroll-container
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
