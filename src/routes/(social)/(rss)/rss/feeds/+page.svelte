<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import RssFeedsView from '$/views/RssFeedsView.svelte'
</script>


<Page>
	<RssFeedsView
		entityFieldReference={{
			entityType: EntityType.RssNetwork,
			entityId: { scope: 'RssNetwork' },
			fieldName: '$$rssFeeds',
		}}
		href={resolve('/rss/feeds')}
		id="rss-feeds"
	/>
</Page>
