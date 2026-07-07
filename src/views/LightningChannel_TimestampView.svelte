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
			selection: EntityProxyResource<typeof schema, EntityType.LightningChannel_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LightningChannel_Timestamp>>
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
	const lightningChannelTimestamp = $derived(selection({
		fields: {
			status: true,
			capacitySats: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Lightning channel timestamp')
	const viewDomId = $derived('lightning-channel-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningChannel_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lightningChannelTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lightningChannelTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? ''), String((prefetched.capacitySats) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'Lightning channel timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? ''), String((resolvedEntity.capacitySats) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Channel</dt>
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

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
						],
						fields: {
							feeRatePpm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeRatePpm = prefetched.feeRatePpm}
					{#if feeRatePpm !== undefined && feeRatePpm !== null}
						<div>
							<dt>Fee rate ppm</dt>
							<dd>
								{String((feeRatePpm) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeRatePpm = resolvedEntity.feeRatePpm}
					{#if feeRatePpm !== undefined && feeRatePpm !== null}
						<div>
							<dt>Fee rate ppm</dt>
							<dd>
								{String((feeRatePpm) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
							Source.LightningLnd_Rest,
						],
						fields: {
							updatedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const updatedAtMs = prefetched.updatedAtMs}
					{#if updatedAtMs !== undefined && updatedAtMs !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								{String((updatedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAtMs = resolvedEntity.updatedAtMs}
					{#if updatedAtMs !== undefined && updatedAtMs !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								{String((updatedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
							Source.LightningLnd_Rest,
						],
						fields: {
							closingTransactionId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const closingTransactionId = prefetched.closingTransactionId}
					{#if closingTransactionId !== undefined && closingTransactionId !== null}
						<div>
							<dt>Closing transaction ID</dt>
							<dd>
								{String((closingTransactionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const closingTransactionId = resolvedEntity.closingTransactionId}
					{#if closingTransactionId !== undefined && closingTransactionId !== null}
						<div>
							<dt>Closing transaction ID</dt>
							<dd>
								{String((closingTransactionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
							Source.LightningLnd_Rest,
						],
						fields: {
							closingFeeSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const closingFeeSats = prefetched.closingFeeSats}
					{#if closingFeeSats !== undefined && closingFeeSats !== null}
						<div>
							<dt>Closing fee sats</dt>
							<dd>
								{String((closingFeeSats) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const closingFeeSats = resolvedEntity.closingFeeSats}
					{#if closingFeeSats !== undefined && closingFeeSats !== null}
						<div>
							<dt>Closing fee sats</dt>
							<dd>
								{String((closingFeeSats) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
							Source.LightningLnd_Rest,
						],
						fields: {
							closingReason: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const closingReason = prefetched.closingReason}
					{#if closingReason !== undefined && closingReason !== null}
						<div>
							<dt>Closing reason</dt>
							<dd>
								{String((closingReason) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const closingReason = resolvedEntity.closingReason}
					{#if closingReason !== undefined && closingReason !== null}
						<div>
							<dt>Closing reason</dt>
							<dd>
								{String((closingReason) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
							Source.LightningLnd_Rest,
						],
						fields: {
							closedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const closedAtMs = prefetched.closedAtMs}
					{#if closedAtMs !== undefined && closedAtMs !== null}
						<div>
							<dt>Closed</dt>
							<dd>
								{String((closedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const closedAtMs = resolvedEntity.closedAtMs}
					{#if closedAtMs !== undefined && closedAtMs !== null}
						<div>
							<dt>Closed</dt>
							<dd>
								{String((closedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
