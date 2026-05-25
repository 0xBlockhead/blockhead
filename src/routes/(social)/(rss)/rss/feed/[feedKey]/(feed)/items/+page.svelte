<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		data,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RssItemsView from '$/views/RssItemsView.svelte'
</script>


<Page>
	<RssItemsView
		href={resolve('/rss/items')}
		entityFieldReference={{
			entityType: EntityType.RssFeed,
			entityId: data.entityId,
			fieldName: '$$items',
		}}
		id="rss-feed-items"
	/>
</Page>
