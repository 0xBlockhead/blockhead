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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.A2aTaskEvent, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.sequence) || 'A2A task event')} • A2A task event • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'A2A task event'} • A2A task event • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<A2aTaskEventView
		selection={pageSelection}
	/>
	{/if}
</Page>
