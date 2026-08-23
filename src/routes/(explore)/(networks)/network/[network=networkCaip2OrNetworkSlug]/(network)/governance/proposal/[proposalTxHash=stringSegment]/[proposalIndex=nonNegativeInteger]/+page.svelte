<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoGovernanceProposalView from '$/views/CardanoGovernanceProposalView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoGovernanceProposal, data.selector, {
				fields: {
					proposalKind: true,
					governanceActionId: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Cardano governance proposal' : [pageSelection.entity.proposalKind, (pageSelection.entity.governanceActionId ?? '')].filter(Boolean).join(' ') || 'Cardano governance proposal')} • Cardano governance proposal • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cardano governance proposal'} • Cardano governance proposal • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CardanoGovernanceProposal, data.selector, {
				fields: {
					proposalKind: true,
					governanceActionId: true,
				},
			})}

	<CardanoGovernanceProposalView
		selection={pageSelection}
	/>
	{/if}
</Page>
