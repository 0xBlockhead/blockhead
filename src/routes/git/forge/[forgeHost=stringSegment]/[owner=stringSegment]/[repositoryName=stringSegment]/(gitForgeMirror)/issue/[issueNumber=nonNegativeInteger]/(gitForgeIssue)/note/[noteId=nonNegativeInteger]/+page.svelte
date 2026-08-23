<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeIssueNoteView from '$/views/GitForgeIssueNoteView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitForgeIssueNote, {
					$issue: data.selector,
					noteId: Number(params.noteId),
				}, {
					sources: [
						Source.Gitlab_Rest,
					],
					fields: {
						body: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.noteId ?? '') || 'Git forge issue note' : pageSelection.entity.body || String(pageSelection.entitySelector.noteId) || 'Git forge issue note')} • Git forge issue note • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Git forge issue note'} • Git forge issue note • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitForgeIssueNote, {
					$issue: data.selector,
					noteId: Number(params.noteId),
				}, {
					sources: [
						Source.Gitlab_Rest,
					],
					fields: {
						body: true,
					},
				}))}

		<GitForgeIssueNoteView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
