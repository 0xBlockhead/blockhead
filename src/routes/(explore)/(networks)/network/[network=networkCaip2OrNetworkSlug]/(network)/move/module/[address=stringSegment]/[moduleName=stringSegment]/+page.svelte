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

	const pageSelection = $derived(select(EntityType.MoveModule, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import MoveModuleView from '$/views/MoveModuleView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.moduleName || 'move module')} • move module • Blockhead</title>
</svelte:head>


<Page>
	<MoveModuleView
		selection={pageSelection}
	/>
</Page>
