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

	const pageSelection = $derived(select(EntityType.GitForgeIssue, {
		$forgeMirror: data.selector,
		issueNumber: Number(params.issueNumber),
	}, {
		fields: {
			title: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgeIssueView from '$/views/GitForgeIssueView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.issueNumber ?? '') || 'Git forge issue' : (pageSelection.entity.title ?? '') || String(pageSelection.entitySelector.issueNumber) || 'Git forge issue')} • Git forge issue • Blockhead</title>
</svelte:head>


<Page>
	<GitForgeIssueView
		selection={pageSelection}
	/>
</Page>
