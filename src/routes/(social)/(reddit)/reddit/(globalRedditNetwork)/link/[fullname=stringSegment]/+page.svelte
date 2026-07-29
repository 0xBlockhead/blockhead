<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
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
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.fullname ?? '') || 'Reddit submission' : (pageSelection.entity.title ?? '') || pageSelection.entitySelector.fullname || 'Reddit submission')} • Reddit submission • Blockhead</title>
</svelte:head>


<Page>
	<RedditLinkView
		selection={pageSelection}
	/>
</Page>
