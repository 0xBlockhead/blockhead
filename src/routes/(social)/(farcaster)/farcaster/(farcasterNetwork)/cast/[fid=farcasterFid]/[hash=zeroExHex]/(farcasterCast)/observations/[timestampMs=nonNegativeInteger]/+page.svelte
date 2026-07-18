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

	const pageSelection = $derived(select(EntityType.FarcasterCast_Timestamp, {
		$cast: {
			fid: Number(params.fid),
			hash: params.hash,
		},
		timestampMs: Number(params.timestampMs),
	}, {
		sources: [
			Source.Snapchain_Rest,
			Source.Neynar_Rest,
		],
		fields: {
			likeCount: true,
			recastCount: true,
			replyCount: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? 'Farcaster cast observation' : 'Farcaster cast observation'))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCast_TimestampView from '$/views/FarcasterCast_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Farcaster cast observation • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCast_TimestampView
		href={
			resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]/observations/[timestampMs=nonNegativeInteger]', {
				fid: params.fid,
				hash: params.hash,
				timestampMs: params.timestampMs,
			})
		}
		selection={pageSelection}
	/>
</Page>
