<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.GitForgePullRequestNote, {
		$pullRequest: data.selector,
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
	import GitForgePullRequestNoteView from '$/views/GitForgePullRequestNoteView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.noteId ?? '') || 'Git forge pull request note' : pageSelection.entity.body || String(pageSelection.entitySelector.noteId) || 'Git forge pull request note')} • Git forge pull request note • Blockhead</title>
</svelte:head>


<Page>
	<GitForgePullRequestNoteView
		selection={pageSelection}
	/>
</Page>
