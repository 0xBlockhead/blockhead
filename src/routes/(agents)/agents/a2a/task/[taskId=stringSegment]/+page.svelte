<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.A2aTask, data.selector, {
		sources: [],
		fields: {
			providerTaskId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import A2aTaskView from '$/views/A2aTaskView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.taskId ?? '') || 'A2A task' : pageSelection.entitySelector.taskId || (pageSelection.entity.providerTaskId ?? '') || 'A2A task')} • A2A task • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'A2A task'} • A2A task • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<A2aTaskView
		selection={pageSelection}
	/>
	{/if}
</Page>
