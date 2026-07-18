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

	const pageSelection = $derived(select(EntityType.CardanoGovernanceProposal, data.selector, {
		sources: [
			Source.Blockfrost_Rest,
		],
		fields: {
			proposalKind: true,
			$transaction: true,
			depositLovelace: true,
			returnAddress: true,
			anchorUrl: true,
			anchorHash: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.proposalKind) ?? ''), (String((pageSelection.entitySelector.proposalTxHash) ?? '') ? 'Proposal ' + String((pageSelection.entitySelector.proposalTxHash) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano governance proposal' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).proposalKind) ?? ''), (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).proposalTxHash) ?? '') ? 'Proposal ' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).proposalTxHash) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano governance proposal')))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoGovernanceProposalView from '$/views/CardanoGovernanceProposalView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Cardano governance proposal • Blockhead</title>
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
