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
	const collection0Selection = $derived(select(EntityType.Network, data.selector).Cosmos.$$governanceProposals)
	const collection1Selection = $derived(select(EntityType.Network, data.selector).Cardano.$$governanceProposals)


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosGovernanceProposalsView from '$/views/CosmosGovernanceProposalsView.svelte'
	import CardanoGovernanceProposalsView from '$/views/CardanoGovernanceProposalsView.svelte'
</script>


<svelte:head>
	<title>Governance • Blockhead</title>
</svelte:head>


<Page>
	<CosmosGovernanceProposalsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance',
				{
					network: String(params.network),
				}
			)
		}
		title='Governance'
		selection={collection0Selection}
		id='governance-proposals'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>

	<CardanoGovernanceProposalsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance',
				{
					network: String(params.network),
				}
			)
		}
		title='Governance'
		selection={collection1Selection}
		id='governance-proposals'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
