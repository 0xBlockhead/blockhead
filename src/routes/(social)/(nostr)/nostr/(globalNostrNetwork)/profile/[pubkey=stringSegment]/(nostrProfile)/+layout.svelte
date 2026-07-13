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
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


{#key params.pubkey}
	<ParentPageCollapsible
		href={
			resolve('/nostr/profile/[pubkey=stringSegment]', {
				pubkey: params.pubkey,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = NostrProfileView}

			<DetailView
				selection={select(EntityType.NostrProfile, data.selector)}
				href={
					resolve('/nostr/profile/[pubkey=stringSegment]', {
						pubkey: params.pubkey,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
