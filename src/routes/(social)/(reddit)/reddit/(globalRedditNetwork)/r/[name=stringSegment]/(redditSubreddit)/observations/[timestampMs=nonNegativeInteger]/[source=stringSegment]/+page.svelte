<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.RedditSubreddit_Timestamp, {
		$subreddit: {
			name: decodeURIComponent(params.name),
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$subreddit: {
				name: decodeURIComponent(params.name),
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			subscriberCount: true,
			activeUserCount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RedditSubreddit_TimestampView from '$/views/RedditSubreddit_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(String(pageSelection.entitySelector.timestampMs) || 'Reddit subreddit timestamp')} • Reddit subreddit timestamp • Blockhead</title>
</svelte:head>


<Page>
	<RedditSubreddit_TimestampView
		selection={pageSelection}
	/>
</Page>
