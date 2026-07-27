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
	}: EntitySelectionViewProps<EntityType.MevBuilder> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.builderPubkey ?? '') || 'MEV builder')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MevBuilder_TimestampsView from '$/views/MevBuilder_TimestampsView.svelte'
	import MevRelay_ProposerPayloadDeliveredsView from '$/views/MevRelay_ProposerPayloadDeliveredsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.MevBuilder}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]',
			{
				network: (
					'caip2' in selection.entitySelector.$network ?
						String(caip2StringFromValue(selection.entitySelector.$network.caip2))
					:
						String(selection.entitySelector.$network.slug)
				),
				builderPubkey: String(selection.entitySelector.builderPubkey),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={pendingEntity.builderPubkey} />
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={pendingEntity.builderPubkey} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Builder public key</dt>
				<dd>
					<TruncatedValue value={pendingEntity.builderPubkey} />
				</dd>
			</div>

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

	{#snippet Details({ open: detailsOpen })}
		{@const mevBuilderMevBuilderTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={mevBuilderMevBuilderTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MevBuilder_TimestampsView
						selection={mevBuilderMevBuilderTimestampsViewTimestampsResource}
						countResource={mevBuilderMevBuilderTimestampsViewTimestampsResource.count}
						title='Timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const mevBuilderMevRelayProposerPayloadDeliveredsViewDeliveredPayloadsResource = selection.$$deliveredPayloads}
		<ResourceBoundary
			resource={mevBuilderMevRelayProposerPayloadDeliveredsViewDeliveredPayloadsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<MevRelay_ProposerPayloadDeliveredsView
						selection={mevBuilderMevRelayProposerPayloadDeliveredsViewDeliveredPayloadsResource}
						countResource={mevBuilderMevRelayProposerPayloadDeliveredsViewDeliveredPayloadsResource.count}
						title='Delivered payloads'
						id='delivered-payloads'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
