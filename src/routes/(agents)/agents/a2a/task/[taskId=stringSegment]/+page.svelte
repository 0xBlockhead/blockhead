<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import A2aTaskView from '$/views/A2aTaskView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.A2aTask, data.selector, {
					sources: [],
					fields: {
						providerTaskId: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.taskId ?? '') || 'A2A task' : pageSelection.entitySelector.taskId || (pageSelection.entity.providerTaskId ?? '') || 'A2A task')} • A2A task • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'A2A task'} • A2A task • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.A2aTask, data.selector, {
					sources: [],
					fields: {
						providerTaskId: true,
					},
				}))}

		<A2aTaskView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
