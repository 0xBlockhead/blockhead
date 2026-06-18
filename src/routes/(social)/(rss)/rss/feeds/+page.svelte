<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import RssFeedsView from '$/views/RssFeedsView.svelte'
</script>


<Page>
	<RssFeedsView
		href={resolve('/rss/feeds')}
		selection={select(
			EntityType.RssNetwork,
			{ scope: 'RssNetwork' },
			{
				sources: [Source.Constants_Internal],
			}
		).$$rssFeeds({
			sources: [Source.Constants_Internal],
		})}
		id="rss-feeds"
	/>
</Page>
