<script lang="ts">
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
		entityId={{ id: params.dashboardId }}
	/>
</Page>
