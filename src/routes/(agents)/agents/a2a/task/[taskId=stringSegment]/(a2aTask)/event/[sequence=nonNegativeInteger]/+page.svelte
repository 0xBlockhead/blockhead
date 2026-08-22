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

	const pageSelection = $derived(select(EntityType.A2aTaskEvent, {
		$task: data.selector,
		sequence: Number(params.sequence),
	}, {
		sources: [],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import A2aTaskEventView from '$/views/A2aTaskEventView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (String(pageSelection.entitySelector.sequence) || 'A2A task event')} • A2A task event • Blockhead</title>
</svelte:head>


<Page>
	<A2aTaskEventView
		selection={pageSelection}
	/>
</Page>
