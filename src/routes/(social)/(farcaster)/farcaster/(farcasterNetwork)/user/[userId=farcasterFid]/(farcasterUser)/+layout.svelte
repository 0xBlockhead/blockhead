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
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


{#key params.userId}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]',
				{
					userId: String(params.userId),
				}
			)
		}
	>
		{#snippet Summary()}
			<FarcasterUserView
				selection={
					select(EntityType.FarcasterUser, data.selector, { sources: [
						Source.Snapchain_Rest,
					] })
				}
				href={
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]',
						{
							userId: String(params.userId),
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
