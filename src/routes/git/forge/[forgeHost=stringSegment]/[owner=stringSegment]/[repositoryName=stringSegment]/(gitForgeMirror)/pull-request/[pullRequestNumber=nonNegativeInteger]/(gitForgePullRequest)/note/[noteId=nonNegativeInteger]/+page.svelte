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
	import GitForgePullRequestNoteView from '$/views/GitForgePullRequestNoteView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitForgePullRequestNote, {
					$pullRequest: data.selector,
					noteId: Number(params.noteId),
				}, {
					sources: [
						Source.Gitlab_Rest,
					],
					fields: {
						body: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.noteId ?? '') || 'Git forge pull request note' : pageSelection.entity.body || String(pageSelection.entitySelector.noteId) || 'Git forge pull request note')} • Git forge pull request note • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Git forge pull request note'} • Git forge pull request note • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.GitForgePullRequestNote, {
					$pullRequest: data.selector,
					noteId: Number(params.noteId),
				}, {
					sources: [
						Source.Gitlab_Rest,
					],
					fields: {
						body: true,
					},
				}))}

		<GitForgePullRequestNoteView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
