<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadPanelTreeView from '$/views/BlockheadPanelTreeView.svelte'
</script>


<Page>
	<BlockheadPanelTreeView
		selection={select(EntityType.BlockheadPanelTree, { id: params.dashboardId })}
	/>
</Page>
