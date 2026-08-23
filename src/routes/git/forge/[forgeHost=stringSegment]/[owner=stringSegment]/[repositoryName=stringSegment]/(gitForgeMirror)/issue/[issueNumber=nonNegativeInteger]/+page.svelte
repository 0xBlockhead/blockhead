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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitForgeIssue, data.selector, {
		fields: {
			title: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeIssueView from '$/views/GitForgeIssueView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.issueNumber ?? '') || 'Git forge issue' : (pageSelection.entity.title ?? '') || String(pageSelection.entitySelector.issueNumber) || 'Git forge issue')} • Git forge issue • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git forge issue'} • Git forge issue • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitForgeIssueView
		selection={pageSelection}
	/>
	{/if}
</Page>
