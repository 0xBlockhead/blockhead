<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.BlockheadLightningChannelState>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadLightningChannelState>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const blockheadLightningChannelState = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			private: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			private: true,
		},
	}))
	const titleFallback = 'blockhead Lightning channel state'
	const viewDomId = $derived('blockhead-lightning-channel-state-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadLightningChannelState_TimestampsView from '$/views/BlockheadLightningChannelState_TimestampsView.svelte'
	import BlockheadLightningHtlcsView from '$/views/BlockheadLightningHtlcsView.svelte'
	import BlockheadLightningNodeStateView from '$/views/BlockheadLightningNodeStateView.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningChannelState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadLightningChannelState}>
			{#snippet children(entity)}
				<LightningChannelView
					selection={select(EntityType.LightningChannel, selection.entitySelector.$channel)}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningChannelState}>
			{#snippet children(entity)}
				<BlockheadLightningNodeStateView
					selection={select(EntityType.BlockheadLightningNodeState, selection.entitySelector.$localNodeState)}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLightningChannelState}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const privateValue0 = resolvedEntity.private}
				{#if privateValue0 !== undefined && privateValue0 !== null}
					<span data-text="muted">
						{privateValue0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>local node state</dt>
				<dd>
					<BlockheadLightningNodeStateView
						selection={select(EntityType.BlockheadLightningNodeState, selection.entitySelector.$localNodeState)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>channel</dt>
				<dd>
					<LightningChannelView
						selection={select(EntityType.LightningChannel, selection.entitySelector.$channel)}
						href={
							(
								selection.entitySelector.$channel != null && 'channelId' in selection.entitySelector.$channel
								&& selection.entitySelector.$channel.channelId != null
								&& selection.entitySelector.$channel != null && '$network' in selection.entitySelector.$channel ?
									selection.entitySelector.$channel.$network != null && 'caip2' in selection.entitySelector.$channel.$network
									&& selection.entitySelector.$channel.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
									channelId: String(selection.entitySelector.$channel.channelId ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$channel.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$channel.$network != null && 'slug' in selection.entitySelector.$channel.$network
										&& selection.entitySelector.$channel.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
										channelId: String(selection.entitySelector.$channel.channelId ?? ''),
										network: String(selection.entitySelector.$channel.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							private: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const privateValue = resolvedEntity.private}
					{#if privateValue !== undefined && privateValue !== null}
						<div>
							<dt>private</dt>
							<dd>
								{privateValue ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							initiator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const initiator = resolvedEntity.initiator}
					{#if initiator !== undefined && initiator !== null}
						<div>
							<dt>initiator</dt>
							<dd>
								{initiator ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadLightningChannelStateBlockheadLightningChannelStateTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadLightningChannelStateBlockheadLightningChannelStateTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadLightningChannelState_TimestampsView
					selection={blockheadLightningChannelStateBlockheadLightningChannelStateTimestampsViewTimestampsResource}
					countResource={blockheadLightningChannelStateBlockheadLightningChannelStateTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='BlockheadLightningChannelState_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blockheadLightningChannelStateBlockheadLightningHtlcsViewHtlcsResource = selection.$$htlcs}
		<ResourceBoundary
			resource={blockheadLightningChannelStateBlockheadLightningHtlcsViewHtlcsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadLightningHtlcsView
					selection={blockheadLightningChannelStateBlockheadLightningHtlcsViewHtlcsResource}
					countResource={blockheadLightningChannelStateBlockheadLightningHtlcsViewHtlcsResource.count}
					title='htlcs'
					id='BlockheadLightningHtlcsView-htlcs'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
