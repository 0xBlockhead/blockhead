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

	const pageSelection = $derived(select(EntityType.CardanoGovernanceProposal, data.selector, {
		fields: {
			proposalKind: true,
			governanceActionId: true,
			$transaction: true,
			depositLovelace: true,
			returnAddress: true,
			anchorUrl: true,
			anchorHash: true,
			proposalPayload: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoGovernanceProposalView from '$/views/CardanoGovernanceProposalView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? 'Cardano governance proposal' : [String((({ ...data.selector, ...pageSelection.entity }).proposalKind) ?? ''), String((({ ...data.selector, ...pageSelection.entity }).governanceActionId) ?? '')].filter(Boolean).join(' ') || 'Cardano governance proposal'))} • Cardano governance proposal • Blockhead</title>
</svelte:head>


<Page>
	<CardanoGovernanceProposalView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', {
				network: params.network,
				proposalTxHash: params.proposalTxHash,
				proposalIndex: params.proposalIndex,
			})
		}
		selection={pageSelection}
	/>
</Page>
