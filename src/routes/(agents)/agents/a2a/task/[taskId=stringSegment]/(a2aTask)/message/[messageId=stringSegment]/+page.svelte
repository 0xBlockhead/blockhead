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

	const pageSelection = $derived(select(EntityType.A2aMessage, data.selector, {
		sources: [],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import A2aMessageView from '$/views/A2aMessageView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.messageId || 'A2A message')} • A2A message • Blockhead</title>
</svelte:head>


<Page>
	<A2aMessageView
		selection={pageSelection}
	/>
</Page>
