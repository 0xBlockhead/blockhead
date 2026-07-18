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

	const pageSelection = $derived(select(EntityType.RedditComment, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.Reddit_PublicJson,
		],
		fields: {
			body: true,
			createdAt: true,
			author: true,
			depth: true,
			$link: true,
			$parentComment: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.body) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit comment' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).body) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).fullname) ?? '')].filter(Boolean).join(' ') || 'Reddit comment')))


	// Components
	import Page from '$/components/Page.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Reddit comment • Blockhead</title>
</svelte:head>


<Page>
	<RedditCommentView
		href={
			resolve('/reddit/comment/[fullname=stringSegment]', {
				fullname: params.fullname,
			})
		}
		selection={pageSelection}
	/>
</Page>
