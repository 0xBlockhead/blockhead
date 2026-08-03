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

	const pageSelection = $derived(select(EntityType.CardanoGovernanceProposal, data.selector, {
		fields: {
			proposalKind: true,
			governanceActionId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoGovernanceProposalView from '$/views/CardanoGovernanceProposalView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'Cardano governance proposal' : [pageSelection.entity.proposalKind, (pageSelection.entity.governanceActionId ?? '')].filter(Boolean).join(' ') || 'Cardano governance proposal')} • Cardano governance proposal • Blockhead</title>
</svelte:head>


<Page>
	<CardanoGovernanceProposalView
		selection={pageSelection}
	/>
</Page>
