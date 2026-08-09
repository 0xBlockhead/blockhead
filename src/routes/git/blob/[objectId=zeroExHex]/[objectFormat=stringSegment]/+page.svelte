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

	const pageSelection = $derived(select(EntityType.GitBlob, {
		objectId: params.objectId,
		objectFormat: params.objectFormat,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GitBlobView from '$/views/GitBlobView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.objectId || 'Git blob'} • Git blob • Blockhead</title>
</svelte:head>


<Page>
	<GitBlobView
		selection={pageSelection}
	/>
</Page>
