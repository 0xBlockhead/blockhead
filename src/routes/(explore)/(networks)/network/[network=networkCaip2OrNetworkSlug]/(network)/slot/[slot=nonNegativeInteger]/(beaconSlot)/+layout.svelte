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
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


{#key [params.network, params.slot].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
				network: params.network,
				slot: params.slot,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = BeaconSlotView}

			<DetailView
				selection={select(EntityType.BeaconSlot, data.selector)}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
						network: params.network,
						slot: params.slot,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
