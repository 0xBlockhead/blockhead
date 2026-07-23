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

	const pageSelection = $derived(select(EntityType.XPost_Timestamp, {
		$post: {
			id: params.postId,
		},
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$post: {
				id: params.postId,
			},
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			likeCount: true,
			retweetCount: true,
			replyCount: true,
			quoteCount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XPost_TimestampView from '$/views/XPost_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'X post observation' : 'X post observation')} • X post observation • Blockhead</title>
</svelte:head>


<Page>
	<XPost_TimestampView
		href={
			resolve('/x/post/[postId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				postId: params.postId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
