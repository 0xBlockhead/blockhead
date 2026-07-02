<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<svelte:head>
	<title>RSS feed • Blockhead</title>
</svelte:head>


<Page>
	<RssFeedView
		href={
			resolve('/(social)/(rss)/rss/feed/[feedKey]', {
				feedKey: params.feedKey,
			})
		}
		selection={
			select(EntityType.RssFeed, data.selector, {
				fields: {
					title: true,
					lastBuildDate: true,
					link: true,
					siteUrl: true,
					language: true,
					description: true,
				},
			})
		}
	/>
</Page>
