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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadLightningHtlc>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadLightningHtlc>
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
	const blockheadLightningHtlc = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			direction: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			direction: true,
		},
	}))
	const titleFallback = $derived([(String((pendingEntity.htlcIndex) ?? '') ? 'HTLC ' + String((pendingEntity.htlcIndex) ?? '') : '')].filter(Boolean).join(' ') || 'blockhead Lightning htlc')
	const viewDomId = $derived('blockhead-lightning-htlc-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadLightningChannelStateView from '$/views/BlockheadLightningChannelStateView.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningHtlc}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadLightningHtlc}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[(String((resolvedEntity.htlcIndex) ?? '') ? 'HTLC ' + String((resolvedEntity.htlcIndex) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningHtlc}>
			{#snippet children(entity)}
				<ResourceBoundary
					resource={selection.$channel}
				>
					{#snippet children(lightningChannel)}
						{#if lightningChannel != null && lightningChannel[EntityMetaKey.Selector] != null}
						<LightningChannelView
							selection={select(EntityType.LightningChannel, lightningChannel[EntityMetaKey.Selector])}
							prefetched={lightningChannel}
							href=""
							layout={EntityLayout.Value}
							open={false}
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLightningHtlc}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const direction0 = resolvedEntity.direction}
				{#if direction0 !== undefined && direction0 !== null}
					<span data-text="muted">
						{String((direction0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>channel state</dt>
				<dd>
					<BlockheadLightningChannelStateView
						selection={select(EntityType.BlockheadLightningChannelState, selection.entitySelector.$channelState)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>channel</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$channel}
					>
						{#snippet children(lightningChannel)}
							{#if lightningChannel != null && lightningChannel[EntityMetaKey.Selector] != null}
								<LightningChannelView
									selection={select(EntityType.LightningChannel, lightningChannel[EntityMetaKey.Selector])}
									prefetched={lightningChannel}
									href={
										(
											lightningChannel[EntityMetaKey.Selector] != null && 'channelId' in lightningChannel[EntityMetaKey.Selector]
											&& lightningChannel[EntityMetaKey.Selector].channelId != null
											&& lightningChannel[EntityMetaKey.Selector] != null && '$network' in lightningChannel[EntityMetaKey.Selector] ?
												lightningChannel[EntityMetaKey.Selector].$network != null && 'caip2' in lightningChannel[EntityMetaKey.Selector].$network
												&& lightningChannel[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
												channelId: String(lightningChannel[EntityMetaKey.Selector].channelId ?? ''),
												network: String(caip2StringFromValue(lightningChannel[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													lightningChannel[EntityMetaKey.Selector].$network != null && 'slug' in lightningChannel[EntityMetaKey.Selector].$network
													&& lightningChannel[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/channels/[channelId=stringSegment]', {
													channelId: String(lightningChannel[EntityMetaKey.Selector].channelId ?? ''),
													network: String(lightningChannel[EntityMetaKey.Selector].$network.slug ?? ''),
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
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>htlc index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									htlcIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const htlcIndex = resolvedEntity.htlcIndex}
							{#if htlcIndex !== undefined && htlcIndex !== null}
								<NumberValue
									value={htlcIndex}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							direction: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const direction = resolvedEntity.direction}
					{#if direction !== undefined && direction !== null}
						<div>
							<dt>direction</dt>
							<dd>
								{String((direction) ?? '')}
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
							amountMsat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountMsat = resolvedEntity.amountMsat}
					{#if amountMsat !== undefined && amountMsat !== null}
						<div>
							<dt>amount msat</dt>
							<dd>
								<NumberValue
									value={amountMsat}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							expiryHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expiryHeight = resolvedEntity.expiryHeight}
					{#if expiryHeight !== undefined && expiryHeight !== null}
						<div>
							<dt>expiry height</dt>
							<dd>
								<NumberValue
									value={expiryHeight}
								/>
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
							hashLock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hashLock = resolvedEntity.hashLock}
					{#if hashLock !== undefined && hashLock !== null}
						<div>
							<dt>hash lock</dt>
							<dd>
								<TruncatedValue value={String((hashLock) ?? '')} />
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
							state: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const state = resolvedEntity.state}
					{#if state !== undefined && state !== null}
						<div>
							<dt>state</dt>
							<dd>
								{String((state) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
