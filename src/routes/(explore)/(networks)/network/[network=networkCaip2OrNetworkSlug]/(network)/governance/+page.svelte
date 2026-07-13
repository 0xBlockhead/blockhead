<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	import CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'
</script>


<svelte:head>
	<title>Governance • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={select(EntityType.Network, data.selector).Cosmos}
	>
		{#snippet Applicable(projection)}
			<CosmosGovernanceProposalsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/governance', {
						network: params.network,
					})
				}
				title='Governance'
				selection={
					projection.$$governanceProposals({
						count: true,
					})
				}
				id='governance-proposals'
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
