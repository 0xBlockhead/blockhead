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
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<svelte:head>
	<title>Subreddit submissions • Blockhead</title>
</svelte:head>


<Page>
	<RedditLinksView
		href={
			resolve('/reddit/r/[name=stringSegment]/links', {
				name: params.name,
			})
		}
		title='Subreddit submissions'
		selection={
			select(EntityType.RedditSubreddit, {
				name: decodeURIComponent(params.name),
			}).$$links({
				sources: [
					Source.Constants_Internal,
					Source.Reddit_PublicJson,
				],
			})
		}
		id='links'
	/>
</Page>
