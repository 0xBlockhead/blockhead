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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.A2aMessagePart, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.partIndex) || 'A2A message part')} • A2A message part • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'A2A message part'} • A2A message part • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<A2aMessagePartView
		selection={pageSelection}
	/>
	{/if}
</Page>
