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
	import CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'
	import CardanoGovernanceProposalsView from '$/views/CardanoGovernanceProposalsView.svelte'
</script>


<svelte:head>
	<title>Governance • Blockhead</title>
</svelte:head>


<Page>
	<ProjectionBoundary
		resource={
			select(EntityType.Network, data.selector).Cosmos
				.$$governanceProposals({
					sources: [
						Source.CosmosSdk_Rest,
					],
				}).Cosmos
		}
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
					projection
						.$$governanceProposals({
							sources: [
								Source.CosmosSdk_Rest,
							],
						})
				}
				id='account-cosmos-governance-proposal'
				data-column-item="flexible"
				data-card
				data-scroll-container
			/>
		{/snippet}
	</ProjectionBoundary>

	<ProjectionBoundary
		resource={
			select(EntityType.Network, data.selector).Cardano
				.$$governanceProposals({
					sources: [
						Source.CardanoKoios_Rest,
					],
				}).Cardano
		}
	>
		{#snippet Applicable(projection)}
			<CardanoGovernanceProposalsView
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/governance', {
						network: params.network,
					})
				}
				title='Governance'
				selection={
					projection
						.$$governanceProposals({
							sources: [
								Source.CardanoKoios_Rest,
							],
						})
				}
				id='account-cardano-governance-proposal'
				data-column-item="flexible"
				data-card
				data-scroll-container
			/>
		{/snippet}
	</ProjectionBoundary>
</Page>
