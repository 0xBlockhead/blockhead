<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// (Derived)


	// Components
	import Page from '$/components/Page.svelte'
	import RssItemsView from '$/views/RssItemsView.svelte'
</script>


<Page>
	<RssItemsView
		href={resolve('/rss/items')}
		selection={select(
			EntityType.RssFeed,
			{
				feedUrl: decodeURIComponent(page.params.feedKey ?? '').trim(),
			}
		).$$items}
		id="rss-feed-items"
	/>
</Page>
