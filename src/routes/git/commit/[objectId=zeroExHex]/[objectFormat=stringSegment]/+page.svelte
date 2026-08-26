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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.GitCommit, {
		objectId: params.objectId,
		objectFormat: params.objectFormat,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitCommitView from '$/views/GitCommitView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.objectId || 'Git commit'} • Git commit • Blockhead</title>
</svelte:head>


<Page>
	<GitCommitView
		selection={pageSelection}
	/>
</Page>
