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
	import GitTreeEntryView from '$/views/GitTreeEntryView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitTreeEntry, {
				$tree: data.selector,
				path: params.path,
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.path || 'Git tree entry')} • Git tree entry • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git tree entry'} • Git tree entry • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitTreeEntry, {
				$tree: data.selector,
				path: params.path,
			})}

	<GitTreeEntryView
		selection={pageSelection}
	/>
	{/if}
</Page>
