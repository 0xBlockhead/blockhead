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


	// Components
	import Page from '$/components/Page.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitRepository, data.selector, {
				fields: {
					repositoryId: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.canonicalRemoteUrl ?? '') || 'Git repository' : [pageSelection.entity.repositoryId, (pageSelection.entitySelector.canonicalRemoteUrl ?? '')].filter(Boolean).join(' ') || 'Git repository')} • Git repository • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Git repository'} • Git repository • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.GitRepository, data.selector, {
				fields: {
					repositoryId: true,
				},
			})}

	<GitRepositoryView
		selection={pageSelection}
	/>
	{/if}
</Page>
