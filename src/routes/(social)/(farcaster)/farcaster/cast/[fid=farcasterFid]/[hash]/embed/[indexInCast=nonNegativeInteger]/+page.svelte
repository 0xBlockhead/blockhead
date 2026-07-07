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
	import FarcasterCastEmbedView from '$/views/FarcasterCastEmbedView.svelte'
</script>


<svelte:head>
	<title>Farcaster cast embed • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCastEmbedView
		href={
			resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]/embed/[indexInCast=nonNegativeInteger]', {
				fid: params.fid,
				hash: params.hash,
				indexInCast: params.indexInCast,
			})
		}
		selection={
			select(EntityType.FarcasterCastEmbed, {
				$cast: {
					fid: Number(params.fid),
					hash: decodeURIComponent(params.hash),
				},
				indexInCast: Number(params.indexInCast),
			}, {
				sources: [
					Source.Snapchain_Rest,
				],
				fields: {
					$icon: true,
					title: true,
					url: true,
					$embeddedCast: true,
					quotedPreviewText: true,
					description: true,
				},
			})
		}
	/>
</Page>
