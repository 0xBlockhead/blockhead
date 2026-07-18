<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.FarcasterCast, data.selector, {
		sources: [
			Source.Snapchain_Rest,
		],
		fields: {
			text: true,
			timestamp: true,
			$author: true,
			$channel: true,
			$parentCast: true,
			parentUrl: true,
			rootParentUrl: true,
			threadHash: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.text) ?? ''), String((pageSelection.entitySelector.hash) ?? '')].filter(Boolean).join(' ') || 'Farcaster cast' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).text) ?? ''), String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).hash) ?? '')].filter(Boolean).join(' ') || 'Farcaster cast')))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Farcaster cast • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterCastView
		href={
			resolve('/farcaster/cast/[fid=farcasterFid]/[hash=zeroExHex]', {
				fid: params.fid,
				hash: params.hash,
			})
		}
		selection={pageSelection}
	/>
</Page>
