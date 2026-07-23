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

	const pageSelection = $derived(select(EntityType.FarcasterCastEmbed, {
		$cast: {
			fid: Number(params.fid),
			hash: params.hash,
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
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastEmbedView from '$/views/FarcasterCastEmbedView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'Farcaster cast embed' : [String((({ ...{
		$cast: {
			fid: Number(params.fid),
			hash: params.hash,
		},
		indexInCast: Number(params.indexInCast),
	}, ...pageSelection.entity }).title) ?? ''), String((({ ...{
		$cast: {
			fid: Number(params.fid),
			hash: params.hash,
		},
		indexInCast: Number(params.indexInCast),
	}, ...pageSelection.entity }).url) ?? '')].filter(Boolean).join(' ') || 'Farcaster cast embed')} • Farcaster cast embed • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCastEmbedView
		href={
			resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]/embed/[indexInCast=nonNegativeInteger]', {
				fid: params.fid,
				hash: params.hash,
				indexInCast: params.indexInCast,
			})
		}
		selection={pageSelection}
	/>
</Page>
