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
	import CosmosGovernanceProposalView from '$/views/CosmosGovernanceProposalView.svelte'
</script>


<svelte:head>
	<title>Cosmos governance proposal • Blockhead</title>
</svelte:head>


<Page>
	<CosmosGovernanceProposalView
		href={
			resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/governance/proposal/[proposalId]', {
				caip2: params.caip2,
				proposalId: params.proposalId,
			})
		}
		selection={
			select(EntityType.CosmosGovernanceProposal, data.selector, {
				fields: {
					title: true,
					metadata: true,
					summary: true,
				},
			})
		}
	/>
</Page>
