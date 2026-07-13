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
			selection: EntityProxyResource<typeof schema, EntityType.EthereumBeaconFinality_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EthereumBeaconFinality_Timestamp>>
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
	const ethereumBeaconFinalityTimestamp = $derived(selection({
		fields: {
			finalizedCheckpointEpoch: true,
		},
	}))
	const titleFallback = $derived([(String((pendingEntity.finalizedCheckpointEpoch) ?? '') ? 'Finalized epoch ' + String((pendingEntity.finalizedCheckpointEpoch) ?? '') : '')].filter(Boolean).join(' ') || 'ethereum beacon finality timestamp')
	const viewDomId = $derived('ethereum-beacon-finality-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.timestampMs !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/finality/[timestampMs=nonNegativeInteger]', {
			network: String(pendingEntity.$network.slug ?? ''),
			timestampMs: String(pendingEntity.timestampMs ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
			{#snippet Pending()}
				{@const finalizedCheckpointEpoch0 = pendingEntity.finalizedCheckpointEpoch}
				{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
					<span>Finalized epoch </span>
					<NumberValue value={Number(finalizedCheckpointEpoch0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const finalizedCheckpointEpoch0 = resolvedEntity.finalizedCheckpointEpoch}
				{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
					<span>Finalized epoch </span>
					<NumberValue value={Number(finalizedCheckpointEpoch0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
			{#snippet Pending()}
				{@const finalizedCheckpointEpoch0 = pendingEntity.finalizedCheckpointEpoch}
				{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
					<NumberValue value={Number(finalizedCheckpointEpoch0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const finalizedCheckpointEpoch0 = resolvedEntity.finalizedCheckpointEpoch}
				{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
					<NumberValue value={Number(finalizedCheckpointEpoch0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
								fields: {
									finalizedCheckpointEpoch: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const finalizedCheckpointEpoch = pendingEntity.finalizedCheckpointEpoch}
							{#if finalizedCheckpointEpoch !== undefined && finalizedCheckpointEpoch !== null}
								<NumberValue value={Number(finalizedCheckpointEpoch)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const finalizedCheckpointEpoch = resolvedEntity.finalizedCheckpointEpoch}
							{#if finalizedCheckpointEpoch !== undefined && finalizedCheckpointEpoch !== null}
								<NumberValue value={Number(finalizedCheckpointEpoch)} />
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
								fields: {
									finalizedCheckpointRoot: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const finalizedCheckpointRoot = pendingEntity.finalizedCheckpointRoot}
							{#if finalizedCheckpointRoot !== undefined && finalizedCheckpointRoot !== null}
								<TruncatedValue value={String((finalizedCheckpointRoot) ?? '')} />
							{/if}
						{/snippet}

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
								fields: {
									currentJustifiedCheckpointEpoch: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const currentJustifiedCheckpointEpoch = pendingEntity.currentJustifiedCheckpointEpoch}
							{#if currentJustifiedCheckpointEpoch !== undefined && currentJustifiedCheckpointEpoch !== null}
								<NumberValue value={Number(currentJustifiedCheckpointEpoch)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const currentJustifiedCheckpointEpoch = resolvedEntity.currentJustifiedCheckpointEpoch}
							{#if currentJustifiedCheckpointEpoch !== undefined && currentJustifiedCheckpointEpoch !== null}
								<NumberValue value={Number(currentJustifiedCheckpointEpoch)} />
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
								fields: {
									currentJustifiedCheckpointRoot: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const currentJustifiedCheckpointRoot = pendingEntity.currentJustifiedCheckpointRoot}
							{#if currentJustifiedCheckpointRoot !== undefined && currentJustifiedCheckpointRoot !== null}
								<TruncatedValue value={String((currentJustifiedCheckpointRoot) ?? '')} />
							{/if}
						{/snippet}

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
								fields: {
									previousJustifiedCheckpointEpoch: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const previousJustifiedCheckpointEpoch = pendingEntity.previousJustifiedCheckpointEpoch}
							{#if previousJustifiedCheckpointEpoch !== undefined && previousJustifiedCheckpointEpoch !== null}
								<NumberValue value={Number(previousJustifiedCheckpointEpoch)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const previousJustifiedCheckpointEpoch = resolvedEntity.previousJustifiedCheckpointEpoch}
							{#if previousJustifiedCheckpointEpoch !== undefined && previousJustifiedCheckpointEpoch !== null}
								<NumberValue value={Number(previousJustifiedCheckpointEpoch)} />
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
								fields: {
									previousJustifiedCheckpointRoot: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const previousJustifiedCheckpointRoot = pendingEntity.previousJustifiedCheckpointRoot}
							{#if previousJustifiedCheckpointRoot !== undefined && previousJustifiedCheckpointRoot !== null}
								<TruncatedValue value={String((previousJustifiedCheckpointRoot) ?? '')} />
							{/if}
						{/snippet}

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
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
