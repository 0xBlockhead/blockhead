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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitForgePullRequest, data.selector, {
		fields: {
			title: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitForgePullRequestView from '$/views/GitForgePullRequestView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? String(pageSelection.entitySelector.pullRequestNumber ?? '') || 'Git forge pull request' : (pageSelection.entity.title ?? '') || String(pageSelection.entitySelector.pullRequestNumber) || 'Git forge pull request')} • Git forge pull request • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git forge pull request'} • Git forge pull request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitForgePullRequestView
		selection={pageSelection}
	/>
	{/if}
</Page>
