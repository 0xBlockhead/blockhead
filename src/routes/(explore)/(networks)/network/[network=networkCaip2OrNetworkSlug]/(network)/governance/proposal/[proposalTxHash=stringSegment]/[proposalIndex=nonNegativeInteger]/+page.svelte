<!-- Generated from APP.ts. Do not edit by hand. -->

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
			$transaction: true,
			$previousAction: true,
			depositLovelace: true,
			returnAddress: true,
			anchorUrl: true,
			anchorHash: true,
			policyHash: true,
			hardForkMajor: true,
			hardForkMinor: true,
			treasuryWithdrawals: true,
			committeeRemovedCredentials: true,
			committeeAdditions: true,
			committeeQuorumNumerator: true,
			committeeQuorumDenominator: true,
			constitutionAnchorUrl: true,
			constitutionAnchorHash: true,
			constitutionScript: true,
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
