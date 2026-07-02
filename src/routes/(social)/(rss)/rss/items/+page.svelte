<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			})[EntityProxyField]<EntityType.RssItem>('$$sourceWindowItems')
		}
		id='RssItemsView-page'
	/>
</Page>
