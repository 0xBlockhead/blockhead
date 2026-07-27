<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadPanelTree, {
		id: params.dashboardId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$workspace: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadPanelTreeView from '$/views/BlockheadPanelTreeView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entitySelector.id || 'dashboard')} • dashboard • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadPanelTreeView
		selection={pageSelection}
	/>
</Page>
