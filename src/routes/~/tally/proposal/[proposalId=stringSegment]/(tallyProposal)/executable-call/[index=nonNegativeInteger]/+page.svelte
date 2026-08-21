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

	const pageSelection = $derived(select(EntityType.TallyProposalExecutableCall, {
		$proposal: data.selector,
		index: Number(params.index),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TallyProposalExecutableCallView from '$/views/TallyProposalExecutableCallView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Call #' + String(pageSelection.entitySelector.index)} • Tally proposal executable call • Blockhead</title>
</svelte:head>


<Page>
	<TallyProposalExecutableCallView
		selection={pageSelection}
	/>
</Page>
