<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadPanelTreesView from '$/views/BlockheadPanelTreesView.svelte'
</script>


<svelte:head>
	<title>Dashboards • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadPanelTreesView
		href={resolve('/~/dashboards')}
		title='Dashboards'
		selection={
			select(EntityType._Global, {
				scope: '$$blockheadPanelTrees',
			}).$$blockheadPanelTrees({
				sources: [
					Source.Local_Internal,
				],
				count: true,
			})
		}
		id='blockhead-panel-trees'
	/>
</Page>
