<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RssItemView from '$/views/RssItemView.svelte'
</script>


<Page>
	<RssItemView
		href={
			resolve('/(social)/(rss)/rss/item/[feedKey]/[guid]', {
				feedKey: params.feedKey,
				guid: params.guid,
			})
		}
		selection={
			select(EntityType.RssItem, {
				feedUrl: decodeURIComponent(params.feedKey),
				guid: decodeURIComponent(params.guid),
			}, {
				sources: [
					Source.Rss_Rest,
					Source.Rss2Json_Rest,
				],
				fields: {
					title: true,
					publishedAt: true,
					$feed: true,
					author: true,
					link: true,
					updatedAt: true,
					enclosureUrl: true,
					commentsUrl: true,
					content: true,
				},
			})
		}
	/>
</Page>
