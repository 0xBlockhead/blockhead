<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import TallyProposalExecutableCallsView from '$/views/TallyProposalExecutableCallsView.svelte'
</script>


<svelte:head>
	<title>Proposal executable calls • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.TallyProposal, {
		proposalId: decodeURIComponent(params.proposalId),
	})
		.$$executableCalls({
			sources: [
				Source.Tally,
			],
		})}

	<TallyProposalExecutableCallsView
		href={
			resolve(
				'/~/tally/proposal/[proposalId=stringSegment]/(tallyProposal)/executable-calls',
				{
					proposalId: params.proposalId,
				}
			)
		}
		title='Proposal executable calls'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='executable-calls'
	/>
</Page>
