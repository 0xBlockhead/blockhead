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
			Source.Constants_Internal,
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
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.title) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit submission' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).title) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit submission')))


	// Components
	import Page from '$/components/Page.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Reddit submission • Blockhead</title>
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
