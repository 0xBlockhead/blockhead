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
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import XPost_TimestampView from '$/views/XPost_TimestampView.svelte'
</script>


<svelte:head>
	<title>X post observation • Blockhead</title>
</svelte:head>


<Page>
	<XPost_TimestampView
		href={
			resolve('/(social)/(x)/x/post/[postId]/observations/[timestampMs=nonNegativeInteger]', {
				postId: params.postId,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.XPost_Timestamp, data.selector, {
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
