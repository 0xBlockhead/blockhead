<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.LightningChannel> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
	}))
	const lightningChannel = $derived(viewSelection({
		fields: {
			shortChannelId: true,
			fundingTransactionId: true,
			fundingOutputIndex: true,
		},
	}))
	const titleFallback = $derived((prefetched.shortChannelId ?? '') || selection.entitySelector.channelId || 'Lightning channel')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LightningChannel_TimestampsView from '$/views/LightningChannel_TimestampsView.svelte'
	import BlockheadLightningChannelStatesView from '$/views/BlockheadLightningChannelStatesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningChannel}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					channelId: selection.entitySelector.channelId,
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
		<ResourceBoundary resource={lightningChannel}>
			{#snippet children(entity)}
				{(entity.shortChannelId ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$node1}
		>
			{#snippet children(lightningNode)}
				{#if lightningNode != null}
					{@const lightningNodeInitial = untrack(() => lightningNode)}
					<LightningNodeView
						selection={select(EntityType.LightningNode, (lightningNode ?? lightningNodeInitial)[EntityMetaKey.Selector])}
						href={null}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Channel ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.channelId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={lightningChannel}
			>
				{#snippet children(entity)}
					{@const shortChannelId = entity.shortChannelId}
					{#if shortChannelId != null}
						<div>
							<dt>Short channel ID</dt>
							<dd>
								{shortChannelId}
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
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$node1}
			>
				{#snippet children(lightningNode)}
					{#if lightningNode != null}
						{@const lightningNodeInitial = untrack(() => lightningNode)}
						<div>
							<dt>Peer node</dt>
							<dd>
								<LightningNodeView
									selection={select(EntityType.LightningNode, (lightningNode ?? lightningNodeInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={lightningChannel}
			>
				{#snippet children(entity)}
					{@const fundingTransactionId = entity.fundingTransactionId}
					{#if fundingTransactionId != null}
						<div>
							<dt>Funding transaction ID</dt>
							<dd>
								{fundingTransactionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={lightningChannel}
			>
				{#snippet children(entity)}
					{@const fundingOutputIndex = entity.fundingOutputIndex}
					{#if fundingOutputIndex != null}
						<div>
							<dt>Funding output index</dt>
							<dd>
								<NumberValue
									value={fundingOutputIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							openedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const openedAtMs = entity.openedAtMs}
					{#if openedAtMs != null}
						<div>
							<dt>Opened</dt>
							<dd>
								<Timestamp timestamp={openedAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<LightningChannel_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const localStatesResource = selection.$$localStates}
		<ResourceBoundary
			resource={localStatesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadLightningChannelStatesView
						selection={localStatesResource}
						countResource={localStatesResource.count}
						title='Local states'
						id='local-states'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
