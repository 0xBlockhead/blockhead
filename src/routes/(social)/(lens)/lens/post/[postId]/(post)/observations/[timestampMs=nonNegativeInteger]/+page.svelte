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
	import LensPost_TimestampView from '$/views/LensPost_TimestampView.svelte'
</script>


<svelte:head>
	<title>Lens post observation • Blockhead</title>
</svelte:head>


<Page>
	<LensPost_TimestampView
		href={
			resolve('/(social)/(lens)/lens/post/[postId]/(post)/observations/[timestampMs=nonNegativeInteger]', {
				postId: params.postId,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.LensPost_Timestamp, data.selector, {
				fields: {
					commentCount: true,
					repostCount: true,
					quoteCount: true,
					bookmarkCount: true,
					collectCount: true,
					reactionCount: true,
				},
			})
		}
	/>
</Page>
