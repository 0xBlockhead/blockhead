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

	const pageSelection = $derived(select(EntityType.GitForgeIssueNote, {
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
	<title>{data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.noteId ?? '') || 'Git forge issue note' : pageSelection.entity.body || String(pageSelection.entitySelector.noteId) || 'Git forge issue note')} • Git forge issue note • Blockhead</title>
</svelte:head>


<Page>
	<GitForgeIssueNoteView
		selection={pageSelection}
	/>
</Page>
