<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.PolkadotPallet> = $props()

	const network = $derived(selection.entitySelector.$network)
	const polkadotPallet = $derived(selection({
		fields: {
			index: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.palletName || 'Polkadot pallet')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotPallet}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/pallet/[palletName=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					palletName: selection.entitySelector.palletName,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.palletName || 'Polkadot pallet'}
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.palletName || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotPallet}>
			{#snippet children(entity)}
				{@const index = entity.index}
				{#if index != null}
					<span data-text="muted">
						{index}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Pallet name</dt>
				<dd>
					{selection.entitySelector.palletName}
				</dd>
			</div>

			<ResourceBoundary
				resource={polkadotPallet}
			>
				{#snippet children(entity)}
					{@const index = entity.index}
					{#if index != null}
						<div>
							<dt>Index</dt>
							<dd>
								{index}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
