<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSourcesView from '$/views/BlockheadSourcesView.svelte'
</script>


<Page>
	<BlockheadSourcesView
		href={resolve('/~/manage/sources')}
		entityFieldReference={{
			entityType: EntityType._Global,
			selector: { scope: '$$blockheadSources' },
			fieldName: '$$blockheadSources',
		}}
		id="sources"
	/>
</Page>
