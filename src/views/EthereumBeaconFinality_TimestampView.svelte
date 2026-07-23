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
			selection: RegisteredEntityProxyResource<EntityType.EthereumBeaconFinality_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EthereumBeaconFinality_Timestamp>
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
	const ethereumBeaconFinalityTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			finalizedCheckpointEpoch: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			finalizedCheckpointEpoch: true,
		},
	}))
	const titleFallback = $derived([(String((pendingEntity.finalizedCheckpointEpoch) ?? '') ? 'Finalized epoch ' + String((pendingEntity.finalizedCheckpointEpoch) ?? '') : '')].filter(Boolean).join(' ') || 'ethereum beacon finality timestamp')
	const viewDomId = $derived('ethereum-beacon-finality-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumBeaconFinality_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/finality/[timestampMs=nonNegativeInteger]', {
				timestampMs: String(selection.entitySelector.timestampMs ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/finality/[timestampMs=nonNegativeInteger]', {
					timestampMs: String(selection.entitySelector.timestampMs ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'finalizedCheckpointEpoch')}
			{@const finalizedCheckpointEpoch0 = pendingEntity.finalizedCheckpointEpoch}
			{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
				<span>Finalized epoch </span>
				<NumberValue
					value={finalizedCheckpointEpoch0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const finalizedCheckpointEpoch0 = resolvedEntity.finalizedCheckpointEpoch}
					{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
						<span>Finalized epoch </span>
						<NumberValue
							value={finalizedCheckpointEpoch0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'finalizedCheckpointEpoch')}
			{@const finalizedCheckpointEpoch0 = pendingEntity.finalizedCheckpointEpoch}
			{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
				<NumberValue
					value={finalizedCheckpointEpoch0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const finalizedCheckpointEpoch0 = resolvedEntity.finalizedCheckpointEpoch}
					{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
						<NumberValue
							value={finalizedCheckpointEpoch0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'finalizedCheckpointEpoch')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestampMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestampMs0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Finalized checkpoint epoch</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									finalizedCheckpointEpoch: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const finalizedCheckpointEpoch = resolvedEntity.finalizedCheckpointEpoch}
							{#if finalizedCheckpointEpoch !== undefined && finalizedCheckpointEpoch !== null}
								<NumberValue
									value={finalizedCheckpointEpoch}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Finalized checkpoint root</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									finalizedCheckpointRoot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const finalizedCheckpointRoot = resolvedEntity.finalizedCheckpointRoot}
							{#if finalizedCheckpointRoot !== undefined && finalizedCheckpointRoot !== null}
								<TruncatedValue value={String((finalizedCheckpointRoot) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Current justified checkpoint epoch</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									currentJustifiedCheckpointEpoch: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const currentJustifiedCheckpointEpoch = resolvedEntity.currentJustifiedCheckpointEpoch}
							{#if currentJustifiedCheckpointEpoch !== undefined && currentJustifiedCheckpointEpoch !== null}
								<NumberValue
									value={currentJustifiedCheckpointEpoch}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Current justified checkpoint root</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									currentJustifiedCheckpointRoot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const currentJustifiedCheckpointRoot = resolvedEntity.currentJustifiedCheckpointRoot}
							{#if currentJustifiedCheckpointRoot !== undefined && currentJustifiedCheckpointRoot !== null}
								<TruncatedValue value={String((currentJustifiedCheckpointRoot) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Previous justified checkpoint epoch</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									previousJustifiedCheckpointEpoch: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const previousJustifiedCheckpointEpoch = resolvedEntity.previousJustifiedCheckpointEpoch}
							{#if previousJustifiedCheckpointEpoch !== undefined && previousJustifiedCheckpointEpoch !== null}
								<NumberValue
									value={previousJustifiedCheckpointEpoch}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Previous justified checkpoint root</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									previousJustifiedCheckpointRoot: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const previousJustifiedCheckpointRoot = resolvedEntity.previousJustifiedCheckpointRoot}
							{#if previousJustifiedCheckpointRoot !== undefined && previousJustifiedCheckpointRoot !== null}
								<TruncatedValue value={String((previousJustifiedCheckpointRoot) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
