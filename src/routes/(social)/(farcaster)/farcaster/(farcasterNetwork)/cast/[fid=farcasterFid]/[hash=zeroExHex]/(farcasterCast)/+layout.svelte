<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


{#key [params.fid, params.hash].join(':')}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]',
				{
					fid: String(params.fid),
					hash: String(params.hash),
				}
			)
		}
	>
		{#snippet Summary()}
			<FarcasterCastView
				selection={
					select(EntityType.FarcasterCast, data.selector, { sources: [
						Source.Snapchain_Rest,
						Source.Neynar_Rest,
						Source.Farcaster_Rest,
					] })
				}
				href={
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]',
						{
							fid: String(params.fid),
							hash: String(params.hash),
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
