<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningChannelState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadLightningChannelState>>
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
	const blockheadLightningChannelState = $derived(selection({
		sources: [
			Source.LightningLnd_Grpc,
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
		fields: {
			private: true,
		},
	}))
	const titleFallback = $derived('blockhead Lightning channel state')
	const viewDomId = $derived('blockhead-lightning-channel-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
			{#snippet Pending()}
				<LightningChannelView
					selection={select(EntityType.LightningChannel, selection.entitySelector.$channel)}
					href={
						(selection.entitySelector.$channel.$network !== undefined && selection.entitySelector.$channel.$network.slug !== undefined && selection.entitySelector.$channel.channelId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/channels/[channelId]', {
							networkSlug: String(selection.entitySelector.$channel.$network.slug ?? ''),
							channelId: String(selection.entitySelector.$channel.channelId ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<LightningChannelView
					selection={select(EntityType.LightningChannel, selection.entitySelector.$channel)}
					href={
						(selection.entitySelector.$channel.$network !== undefined && selection.entitySelector.$channel.$network.slug !== undefined && selection.entitySelector.$channel.channelId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/channels/[channelId]', {
							networkSlug: String(selection.entitySelector.$channel.$network.slug ?? ''),
							channelId: String(selection.entitySelector.$channel.channelId ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningChannelState}>
			{#snippet Pending()}
				<BlockheadLightningNodeStateView
					selection={select(EntityType.BlockheadLightningNodeState, selection.entitySelector.$localNodeState)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<BlockheadLightningNodeStateView
					selection={select(EntityType.BlockheadLightningNodeState, selection.entitySelector.$localNodeState)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLightningChannelState}>
			{#snippet Pending()}
				{@const privateValue0 = prefetched.private}
				{#if privateValue0 !== undefined && privateValue0 !== null}
					<span data-text="muted">
						{privateValue0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

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
						selection={select(EntityType.BlockheadLightningNodeState, selection.entitySelector.$localNodeState, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>channel</dt>
				<dd>
					<LightningChannelView
						selection={select(EntityType.LightningChannel, selection.entitySelector.$channel, {})}
						href={
							(selection.entitySelector.$channel.$network !== undefined && selection.entitySelector.$channel.$network.slug !== undefined && selection.entitySelector.$channel.channelId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/channels/[channelId]', {
								networkSlug: String(selection.entitySelector.$channel.$network.slug ?? ''),
								channelId: String(selection.entitySelector.$channel.channelId ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							private: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const privateValue = prefetched.private}
					{#if privateValue !== undefined && privateValue !== null}
						<div>
							<dt>private</dt>
							<dd>
								{privateValue ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							initiator: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const initiator = prefetched.initiator}
					{#if initiator !== undefined && initiator !== null}
						<div>
							<dt>initiator</dt>
							<dd>
								{initiator ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<BlockheadLightningChannelState_TimestampsView
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No state observations.'
				id='BlockheadLightningChannelState_TimestampsView-timestamps'
			/>

			<BlockheadLightningHtlcsView
				selection={selection.$$htlcs}
				title='htlcs'
				emptyText='No pending HTLCs.'
				id='BlockheadLightningHtlcsView-htlcs'
			/>
		{/if}
	{/snippet}
</EntityView>
