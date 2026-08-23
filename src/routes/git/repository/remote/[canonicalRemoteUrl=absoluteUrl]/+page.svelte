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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.GitRepository, data.selector, {
		fields: {
			repositoryId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.canonicalRemoteUrl ?? '') || 'Git repository' : [pageSelection.entity.repositoryId, (pageSelection.entitySelector.canonicalRemoteUrl ?? '')].filter(Boolean).join(' ') || 'Git repository')} • Git repository • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git repository'} • Git repository • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GitRepositoryView
		selection={pageSelection}
	/>
	{/if}
</Page>
