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

	const pageSelection = $derived(select(EntityType.RedditLink, data.selector, {
		sources: [
			Source.Reddit_PublicJson,
		],
		fields: {
			title: true,
			createdAt: true,
			selftext: true,
			author: true,
			$subreddit: true,
			url: true,
			permalink: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit submission' : [String((({ ...data.selector, ...pageSelection.entity }).title) ?? '')].filter(Boolean).join(' ') || [String((({ ...data.selector, ...pageSelection.entity }).fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit submission'))} • Reddit submission • Blockhead</title>
</svelte:head>


<Page>
	<RedditLinkView
		href={
			resolve('/reddit/link/[fullname=stringSegment]', {
				fullname: params.fullname,
			})
		}
		selection={pageSelection}
	/>
</Page>
