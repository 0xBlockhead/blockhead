<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadPanelTreesView from '$/views/BlockheadPanelTreesView.svelte'
</script>


<Page>
	<BlockheadPanelTreesView
		href={resolve('/~/manage/data')}
		selection={select(
			EntityType._Global,
			{ scope: '$$blockheadPanelTrees' }
		).$$blockheadPanelTrees}
		id="dashboards"
	/>
</Page>
