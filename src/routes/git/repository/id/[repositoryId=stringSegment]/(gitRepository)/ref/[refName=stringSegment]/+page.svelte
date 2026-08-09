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

	const pageSelection = $derived(select(EntityType.GitRef, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import GitRefView from '$/views/GitRefView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.refName || 'Git ref')} • Git ref • Blockhead</title>
</svelte:head>


<Page>
	<GitRefView
		selection={pageSelection}
	/>
</Page>
