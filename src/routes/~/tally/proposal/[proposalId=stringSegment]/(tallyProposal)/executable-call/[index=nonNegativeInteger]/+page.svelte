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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TallyProposalExecutableCallView from '$/views/TallyProposalExecutableCallView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TallyProposalExecutableCall, {
				$proposal: data.selector,
				index: Number(params.index),
			})}
		<title>{data?.title ?? 'Call #' + String(pageSelection.entitySelector.index)} • Tally proposal executable call • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Tally proposal executable call'} • Tally proposal executable call • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.TallyProposalExecutableCall, {
				$proposal: data.selector,
				index: Number(params.index),
			})}

	<TallyProposalExecutableCallView
		selection={pageSelection}
	/>
	{/if}
</Page>
