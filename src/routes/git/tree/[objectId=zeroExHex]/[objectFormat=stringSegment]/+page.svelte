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

	const pageSelection = $derived(select(EntityType.GitTree, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import GitTreeView from '$/views/GitTreeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.objectId || 'Git tree')} • Git tree • Blockhead</title>
</svelte:head>


<Page>
	<GitTreeView
		selection={pageSelection}
	/>
</Page>
