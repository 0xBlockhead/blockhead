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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.A2aMessage, data.selector, {
		sources: [],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import A2aMessageView from '$/views/A2aMessageView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.messageId || 'A2A message')} • A2A message • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'A2A message'} • A2A message • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<A2aMessageView
		selection={pageSelection}
	/>
	{/if}
</Page>
