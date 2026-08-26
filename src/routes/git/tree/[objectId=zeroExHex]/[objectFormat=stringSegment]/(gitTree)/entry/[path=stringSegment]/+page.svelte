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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitTreeEntry, {
		$tree: data.selector,
		path: params.path,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitTreeEntryView from '$/views/GitTreeEntryView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.path || 'Git tree entry')} • Git tree entry • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git tree entry'} • Git tree entry • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitTreeEntryView
		selection={pageSelection}
	/>
	{/if}
</Page>
