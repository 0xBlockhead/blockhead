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
	import XPost_TimestampView from '$/views/XPost_TimestampView.svelte'
</script>


<Page>
	<XPost_TimestampView
		href={
			resolve('/(social)/(x)/x/post/[postId]/observations/[timestampMs=nonNegativeInteger]', {
				postId: params.postId,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.XPost_Timestamp, {
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
			})
		}
	/>
</Page>
