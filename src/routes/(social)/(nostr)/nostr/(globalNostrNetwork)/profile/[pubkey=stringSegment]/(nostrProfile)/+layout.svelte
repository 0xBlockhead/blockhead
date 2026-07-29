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
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


{#key params.pubkey}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]',
				{
					pubkey: params.pubkey,
				}
			)
		}
	>
		{#snippet Summary()}
			<NostrProfileView
				selection={
					select(EntityType.NostrProfile, data.selector, { sources: [
						Source.Constants_Internal,
						Source.NostrBand_Rest,
						Source.Primal_Rest,
					] })
				}
				href={
					resolve(
						'/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]',
						{
							pubkey: params.pubkey,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
