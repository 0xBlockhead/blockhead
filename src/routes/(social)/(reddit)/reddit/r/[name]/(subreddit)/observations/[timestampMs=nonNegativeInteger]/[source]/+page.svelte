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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RedditSubreddit_TimestampView from '$/views/RedditSubreddit_TimestampView.svelte'
</script>


<Page>
	<RedditSubreddit_TimestampView
		href={
			resolve('/(social)/(reddit)/reddit/r/[name]/(subreddit)/observations/[timestampMs=nonNegativeInteger]/[source]', {
				name: params.name,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.RedditSubreddit_Timestamp, {
				$subreddit: {
					name: decodeURIComponent(params.name),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$subreddit: {
					name: decodeURIComponent(params.name),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					subscriberCount: true,
					activeUserCount: true,
				},
			})
		}
	/>
</Page>
