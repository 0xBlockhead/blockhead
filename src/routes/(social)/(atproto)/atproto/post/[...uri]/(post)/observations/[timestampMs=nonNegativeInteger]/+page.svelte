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


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoPost_TimestampView from '$/views/AtprotoPost_TimestampView.svelte'
</script>


<Page>
	<AtprotoPost_TimestampView
		href={
			resolve('/(social)/(atproto)/atproto/post/[...uri]/(post)/observations/[timestampMs=nonNegativeInteger]', {
				uri: params.uri,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.AtprotoPost_Timestamp, {
				$post: {
					uri: decodeURIComponent(params.uri),
				},
				timestampMs: Number(params.timestampMs),
			}, {
				fields: {
					likeCount: true,
					repostCount: true,
					replyCount: true,
					quoteCount: true,
				},
			})
		}
	/>
</Page>
