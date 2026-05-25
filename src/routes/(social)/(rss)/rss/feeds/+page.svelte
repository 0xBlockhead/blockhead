<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import RssFeedsView from '$/views/RssFeedsView.svelte'
</script>


<Page>
	<RssFeedsView
		href={resolve('/rss/feeds')}
		entityFieldReference={{
			entityType: EntityType.RssNetwork,
			entityId: { scope: 'RssNetwork' },
			fieldName: '$$rssFeeds',
		}}
		id="rss-feeds"
	/>
</Page>
