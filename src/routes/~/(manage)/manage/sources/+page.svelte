<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSourcesView from '$/views/BlockheadSourcesView.svelte'
</script>


<Page>
	<BlockheadSourcesView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$blockheadSources',
		}}
		href={resolve('/~/manage/sources')}
		id="sources"
	/>
</Page>
