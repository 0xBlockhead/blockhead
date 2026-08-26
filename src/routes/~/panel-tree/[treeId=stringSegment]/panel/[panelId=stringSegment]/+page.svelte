<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadPanel, {
		treeId: params.treeId,
		panelId: params.panelId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			kind: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadPanelView from '$/views/BlockheadPanelView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'panel' : pageSelection.entity.kind || 'panel'} • panel • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadPanelView
		selection={pageSelection}
	/>
</Page>
