<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.GitRepository, {
		canonicalRemoteUrl: decodeURIComponent(params.canonicalRemoteUrl),
	}, {
		fields: {
			repositoryId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.canonicalRemoteUrl ?? '') || 'Git repository' : [pageSelection.entity.repositoryId, (pageSelection.entitySelector.canonicalRemoteUrl ?? '')].filter(Boolean).join(' ') || 'Git repository'} • Git repository • Blockhead</title>
</svelte:head>


<Page>
	<GitRepositoryView
		selection={pageSelection}
	/>
</Page>
