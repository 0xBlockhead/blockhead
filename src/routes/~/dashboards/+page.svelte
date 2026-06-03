<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadPanelTreesView from '$/views/BlockheadPanelTreesView.svelte'
</script>


<Page>
	<BlockheadPanelTreesView
		href={resolve('/~/manage/data')}
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: { scope: '$$blockheadPanelTrees' },
			fieldName: '$$blockheadPanelTrees',
		}}
		id="dashboards"
	/>
</Page>
