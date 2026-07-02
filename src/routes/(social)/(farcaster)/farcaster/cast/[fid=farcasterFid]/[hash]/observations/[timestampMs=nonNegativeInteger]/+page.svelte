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
	import FarcasterCast_TimestampView from '$/views/FarcasterCast_TimestampView.svelte'
</script>


<svelte:head>
	<title>Farcaster cast observation • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCast_TimestampView
		href={
			resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]/observations/[timestampMs=nonNegativeInteger]', {
				fid: params.fid,
				hash: params.hash,
				timestampMs: params.timestampMs,
			})
		}
		selection={
			select(EntityType.FarcasterCast_Timestamp, data.selector, {
				fields: {
					likeCount: true,
					recastCount: true,
					replyCount: true,
				},
			})
		}
	/>
</Page>
