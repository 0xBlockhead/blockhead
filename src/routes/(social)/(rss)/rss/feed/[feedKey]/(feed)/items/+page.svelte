<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


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
		entityFieldReference={{
			entityType: EntityType.RssFeed,
			entityId: data.entityId,
			fieldName: '$$items',
		}}
		href={resolve('/(social)/(rss)/rss/feed/[feedKey]/(feed)/items', {
			feedKey: encodeURIComponent(data.entityId.feedUrl),
		})}
		id="rss-feed-items"
	/>
</Page>
