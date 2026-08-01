<!-- Generated from APP.ts. -->

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


	// Components
	import Page from '$/components/Page.svelte'
	import XPost_TimestampView from '$/views/XPost_TimestampView.svelte'
</script>


<svelte:head>
	<title>{'X post observation'} • X post observation • Blockhead</title>
</svelte:head>


<Page>
	<XPost_TimestampView
		selection={
			select(EntityType.XPost_Timestamp, {
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
			})
		}
	/>
</Page>
