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
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<Page>
	<FarcasterCastView
		href={
			resolve('/(social)/(farcaster)/farcaster/cast/[fid=farcasterFid]/[hash]', {
				fid: params.fid,
				hash: params.hash,
			})
		}
		selection={
			select(EntityType.FarcasterCast, {
				fid: Number(params.fid),
				hash: decodeURIComponent(params.hash),
			}, {
				sources: [
					Source.Snapchain_Rest,
					Source.Farcaster_Rest,
					Source.Neynar_Rest,
				],
				fields: {
					text: true,
					timestamp: true,
					$author: true,
					$channel: true,
					$parentCast: true,
					parentUrl: true,
					threadHash: true,
				},
			})
		}
	/>
</Page>
