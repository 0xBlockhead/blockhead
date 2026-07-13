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
	import BeaconWithdrawalsView from '$/views/BeaconWithdrawalsView.svelte'
</script>


<svelte:head>
	<title>Beacon withdrawals • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Evm}
	>
		{#snippet Applicable(projection)}
			<BeaconWithdrawalsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/withdrawals', {
						network: params.network,
					})
				}
				title='Beacon withdrawals'
				selection={
					projection.$$beaconWithdrawals({
						sources: [
							Source.Beacon_Rest,
						],
					})
				}
				id='beacon-withdrawals'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
