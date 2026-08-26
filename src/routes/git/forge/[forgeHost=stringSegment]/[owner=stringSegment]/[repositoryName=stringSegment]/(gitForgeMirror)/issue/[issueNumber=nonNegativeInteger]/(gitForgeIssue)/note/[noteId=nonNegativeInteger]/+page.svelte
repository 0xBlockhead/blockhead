<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitForgeIssueNote, {
		$issue: data.selector,
		noteId: Number(params.noteId),
	}, {
		sources: [
			Source.Gitlab_Rest,
		],
		fields: {
			body: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeIssueNoteView from '$/views/GitForgeIssueNoteView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.noteId ?? '') || 'Git forge issue note' : pageSelection.entity.body || String(pageSelection.entitySelector.noteId) || 'Git forge issue note')} • Git forge issue note • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git forge issue note'} • Git forge issue note • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitForgeIssueNoteView
		selection={pageSelection}
	/>
	{/if}
</Page>
