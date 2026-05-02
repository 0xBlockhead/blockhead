<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadPanelTreesView from '$/views/BlockheadPanelTreesView.svelte'
</script>


<Page>
	<BlockheadPanelTreesView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$blockheadPanelTrees',
		}}
		href={resolve('/~/dashboards')}
		id="dashboards"
	/>
</Page>
