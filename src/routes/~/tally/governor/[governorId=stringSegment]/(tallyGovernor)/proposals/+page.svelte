<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import TallyProposalsView from '$/views/TallyProposalsView.svelte'
</script>


<svelte:head>
	<title>Governor proposals • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.TallyGovernor, {
		governorId: decodeURIComponent(params.governorId),
	})
		.$$proposals({
			sources: [
				Source.Tally,
			],
		})}

	<TallyProposalsView
		href={
			resolve(
				'/~/tally/governor/[governorId=stringSegment]/(tallyGovernor)/proposals',
				{
					governorId: params.governorId,
				}
			)
		}
		title='Governor proposals'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='proposals'
	/>
</Page>
