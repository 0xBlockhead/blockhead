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
	import RssItemsView from '$/views/RssItemsView.svelte'
</script>


<svelte:head>
	<title>RSS items • Blockhead</title>
</svelte:head>


<Page>
	<RssItemsView
		href={resolve('/(social)/(rss)/rss/items')}
		title='RSS items'
		selection={
			select(EntityType.RssNetwork, {
				scope: 'RssNetwork',
			}).$$observedItems({
				sources: [
					Source.Rss_Rest,
					Source.Rss2Json_Rest,
				],
			})
		}
		id='observed-items'
	/>
</Page>
