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

	const pageSelection = $derived(select(EntityType.GitRepository, data.selector, {
		fields: {
			canonicalRemoteUrl: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.repositoryId ?? '') || 'Git repository' : [pageSelection.entitySelector.repositoryId, (pageSelection.entity.canonicalRemoteUrl ?? '')].filter(Boolean).join(' ') || 'Git repository')} • Git repository • Blockhead</title>
</svelte:head>


<Page>
	<GitRepositoryView
		selection={pageSelection}
	/>
</Page>
