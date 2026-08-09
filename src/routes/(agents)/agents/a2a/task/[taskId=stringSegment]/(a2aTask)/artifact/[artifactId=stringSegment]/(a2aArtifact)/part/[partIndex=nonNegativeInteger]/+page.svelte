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

	const pageSelection = $derived(select(EntityType.A2aMessagePart, {
		$artifact: data.selector,
		partIndex: Number(params.partIndex),
	}, {
		sources: [],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import A2aMessagePartView from '$/views/A2aMessagePartView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.partIndex) || 'A2A message part')} • A2A message part • Blockhead</title>
</svelte:head>


<Page>
	<A2aMessagePartView
		selection={pageSelection}
	/>
</Page>
