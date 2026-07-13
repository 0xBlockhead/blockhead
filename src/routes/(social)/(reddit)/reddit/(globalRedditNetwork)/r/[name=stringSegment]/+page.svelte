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
			Source.Constants_Internal,
		],
		fields: {
			$icon: true,
			title: true,
			publicDescription: true,
			createdAt: true,
			over18: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.title) ?? '')].filter(Boolean).join(' ') || [(String((pageSelection.entitySelector.name) ?? '') ? 'r/' + String((pageSelection.entitySelector.name) ?? '') : '')].filter(Boolean).join(' ') || 'Reddit subreddit' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).title) ?? '')].filter(Boolean).join(' ') || [(String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).name) ?? '') ? 'r/' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).name) ?? '') : '')].filter(Boolean).join(' ') || 'Reddit subreddit')))


	// Components
	import Page from '$/components/Page.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Reddit subreddit • Blockhead</title>
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
