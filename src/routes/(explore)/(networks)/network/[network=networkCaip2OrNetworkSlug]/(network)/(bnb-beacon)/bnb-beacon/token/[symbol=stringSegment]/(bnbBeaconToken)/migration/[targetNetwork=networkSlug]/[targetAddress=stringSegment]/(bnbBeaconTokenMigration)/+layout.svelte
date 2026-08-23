<!-- Generated from APP.ts. -->

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

	const detailHref = $derived(
		resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/token/[symbol=stringSegment]/(bnbBeaconToken)/migration/[targetNetwork=networkSlug]/[targetAddress=stringSegment]',
			{
				network: params.network,
				symbol: params.symbol,
				targetNetwork: params.targetNetwork,
				targetAddress: params.targetAddress,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.BnbBeaconTokenMigration, data.selector))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BnbBeaconTokenMigrationView from '$/views/BnbBeaconTokenMigrationView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<BnbBeaconTokenMigrationView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
