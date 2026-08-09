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

	const pageSelection = $derived(select(EntityType.GitForgePullRequest, {
		$forgeMirror: data.selector,
		pullRequestNumber: Number(params.pullRequestNumber),
	}, {
		fields: {
			title: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgePullRequestView from '$/views/GitForgePullRequestView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.pullRequestNumber ?? '') || 'Git forge pull request' : (pageSelection.entity.title ?? '') || String(pageSelection.entitySelector.pullRequestNumber) || 'Git forge pull request')} • Git forge pull request • Blockhead</title>
</svelte:head>


<Page>
	<GitForgePullRequestView
		selection={pageSelection}
	/>
</Page>
