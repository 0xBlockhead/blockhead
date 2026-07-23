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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.RedditSubreddit, data.selector, {
		sources: [
			Source.Reddit_PublicJson,
		],
		fields: {
			$icon: true,
			title: true,
			publicDescription: true,
			createdAt: true,
			over18: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [(String((data.selector.name) ?? '') ? 'r/' + String((data.selector.name) ?? '') : '')].filter(Boolean).join(' ') || 'Reddit subreddit' : [String((({ ...data.selector, ...pageSelection.entity }).title) ?? '')].filter(Boolean).join(' ') || [(String((({ ...data.selector, ...pageSelection.entity }).name) ?? '') ? 'r/' + String((({ ...data.selector, ...pageSelection.entity }).name) ?? '') : '')].filter(Boolean).join(' ') || 'Reddit subreddit'))} • Reddit subreddit • Blockhead</title>
</svelte:head>


<Page>
	<RedditSubredditView
		href={
			resolve('/reddit/r/[name=stringSegment]', {
				name: params.name,
			})
		}
		selection={pageSelection}
	/>
</Page>
