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
	import A2aTaskEventView from '$/views/A2aTaskEventView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.A2aTaskEvent, {
				$task: data.selector,
				sequence: Number(params.sequence),
			}, {
				sources: [],
			})}
		<title>{data?.title ?? (String(pageSelection.entitySelector.sequence) || 'A2A task event')} • A2A task event • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'A2A task event'} • A2A task event • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.A2aTaskEvent, {
				$task: data.selector,
				sequence: Number(params.sequence),
			}, {
				sources: [],
			})}

	<A2aTaskEventView
		selection={pageSelection}
	/>
	{/if}
</Page>
