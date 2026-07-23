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
	import BlockheadSourcesView from '$/views/BlockheadSourcesView.svelte'
</script>


<svelte:head>
	<title>Sources • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSourcesView
		href={resolve('/~/manage/sources')}
		title='Sources'
		selection={
			select(EntityType._Global, {
				scope: '$$blockheadSources',
			})
				.$$blockheadSources({
					sources: [
						Source.Local_Internal,
					],
				})
		}
		countResource={
			select(EntityType._Global, {
				scope: '$$blockheadSources',
			})
				.$$blockheadSources({
					sources: [
						Source.Local_Internal,
					],
				}).count
		}
		id='blockhead-sources'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
