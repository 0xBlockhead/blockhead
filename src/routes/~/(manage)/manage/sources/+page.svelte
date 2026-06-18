<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(
			EntityType._Global,
			{ scope: '$$blockheadSources' }
		).$$blockheadSources}
		id="sources"
	/>
</Page>
