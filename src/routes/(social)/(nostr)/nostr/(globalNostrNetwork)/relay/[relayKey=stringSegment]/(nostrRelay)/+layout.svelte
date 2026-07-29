<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	import NostrRelayView from '$/views/NostrRelayView.svelte'
</script>


{#key params.relayKey}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]',
				{
					relayKey: params.relayKey,
				}
			)
		}
	>
		{#snippet Summary()}
			<NostrRelayView
				selection={select(EntityType.NostrRelay, data.selector)}
				href={
					resolve(
						'/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]',
						{
							relayKey: params.relayKey,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
