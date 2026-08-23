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
	import A2aMessagePartView from '$/views/A2aMessagePartView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.A2aMessagePart, {
				$message: data.selector,
				partIndex: Number(params.partIndex),
			}, {
				sources: [],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.partIndex) || 'A2A message part')} • A2A message part • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'A2A message part'} • A2A message part • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.A2aMessagePart, {
				$message: data.selector,
				partIndex: Number(params.partIndex),
			}, {
				sources: [],
			})}

	<A2aMessagePartView
		selection={pageSelection}
	/>
	{/if}
</Page>
