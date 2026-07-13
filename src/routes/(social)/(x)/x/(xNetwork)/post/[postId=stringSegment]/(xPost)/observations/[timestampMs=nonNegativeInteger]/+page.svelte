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

	const pageSelection = $derived(select(EntityType.XPost_Timestamp, {
		$post: {
			id: decodeURIComponent(params.postId),
		},
		timestampMs: Number(params.timestampMs),
	}, {
		sources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
		fields: {
			likeCount: true,
			retweetCount: true,
			replyCount: true,
			quoteCount: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? 'X post observation' : 'X post observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import XPost_TimestampView from '$/views/XPost_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • X post observation • Blockhead</title>
</svelte:head>


<Page>
	<XPost_TimestampView
		href={
			resolve('/x/post/[postId=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
				postId: params.postId,
				timestampMs: params.timestampMs,
			})
		}
		selection={pageSelection}
	/>
</Page>
