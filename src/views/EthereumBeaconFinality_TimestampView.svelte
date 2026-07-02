<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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

	const ethereumBeaconFinalityTimestamp = $derived(selection({
		fields: {
			finalizedCheckpointEpoch: true,
			finalizedCheckpointRoot: true,
			currentJustifiedCheckpointEpoch: true,
			currentJustifiedCheckpointRoot: true,
			previousJustifiedCheckpointEpoch: true,
			previousJustifiedCheckpointRoot: true,
		},
	}))
	const titleFallback = $derived(['Finalized epoch ' + String((({ ...selection.entitySelector, ...prefetched }).finalizedCheckpointEpoch) ?? '')].filter(Boolean).join(' ') || 'ethereum beacon finality timestamp')
	const viewDomId = $derived('ethereum-beacon-finality-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumBeaconFinality_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/finality/[timestampMs=nonNegativeInteger]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const finalizedCheckpointEpoch0 = ({ ...selection.entitySelector, ...prefetched }).finalizedCheckpointEpoch}
			{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
				<span>Finalized epoch </span>
				<NumberValue value={Number(finalizedCheckpointEpoch0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
				{#snippet Pending()}
					{@const finalizedCheckpointEpoch0 = ({ ...selection.entitySelector, ...prefetched }).finalizedCheckpointEpoch}
					{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
						<span>Finalized epoch </span>
						<NumberValue value={Number(finalizedCheckpointEpoch0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const finalizedCheckpointEpoch0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).finalizedCheckpointEpoch}
					{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
						<span>Finalized epoch </span>
						<NumberValue value={Number(finalizedCheckpointEpoch0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const finalizedCheckpointEpoch0 = ({ ...selection.entitySelector, ...prefetched }).finalizedCheckpointEpoch}
			{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
				<NumberValue value={Number(finalizedCheckpointEpoch0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
				{#snippet Pending()}
					{@const finalizedCheckpointEpoch0 = ({ ...selection.entitySelector, ...prefetched }).finalizedCheckpointEpoch}
					{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
						<NumberValue value={Number(finalizedCheckpointEpoch0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const finalizedCheckpointEpoch0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).finalizedCheckpointEpoch}
					{#if finalizedCheckpointEpoch0 !== undefined && finalizedCheckpointEpoch0 !== null}
						<NumberValue value={Number(finalizedCheckpointEpoch0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = prefetched.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestampMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = prefetched.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestampMs0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = entity.timestampMs}
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
				<dt>Finalized checkpoint root</dt>
				<dd>
					<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
						{#snippet Pending()}
							{@const finalizedCheckpointRoot = prefetched.finalizedCheckpointRoot ?? selection.entitySelector.finalizedCheckpointRoot}
							{#if finalizedCheckpointRoot !== undefined && finalizedCheckpointRoot !== null}
								<TruncatedValue value={String(finalizedCheckpointRoot)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const finalizedCheckpointRoot = entity.finalizedCheckpointRoot ?? selection.entitySelector.finalizedCheckpointRoot ?? prefetched.finalizedCheckpointRoot}
							{#if finalizedCheckpointRoot !== undefined && finalizedCheckpointRoot !== null}
								<TruncatedValue value={String(finalizedCheckpointRoot)} />
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
					<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
						{#snippet Pending()}
							{@const currentJustifiedCheckpointEpoch = prefetched.currentJustifiedCheckpointEpoch ?? selection.entitySelector.currentJustifiedCheckpointEpoch}
							{#if currentJustifiedCheckpointEpoch !== undefined && currentJustifiedCheckpointEpoch !== null}
								<NumberValue value={Number(currentJustifiedCheckpointEpoch)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const currentJustifiedCheckpointEpoch = entity.currentJustifiedCheckpointEpoch ?? selection.entitySelector.currentJustifiedCheckpointEpoch ?? prefetched.currentJustifiedCheckpointEpoch}
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
					<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
						{#snippet Pending()}
							{@const currentJustifiedCheckpointRoot = prefetched.currentJustifiedCheckpointRoot ?? selection.entitySelector.currentJustifiedCheckpointRoot}
							{#if currentJustifiedCheckpointRoot !== undefined && currentJustifiedCheckpointRoot !== null}
								<TruncatedValue value={String(currentJustifiedCheckpointRoot)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const currentJustifiedCheckpointRoot = entity.currentJustifiedCheckpointRoot ?? selection.entitySelector.currentJustifiedCheckpointRoot ?? prefetched.currentJustifiedCheckpointRoot}
							{#if currentJustifiedCheckpointRoot !== undefined && currentJustifiedCheckpointRoot !== null}
								<TruncatedValue value={String(currentJustifiedCheckpointRoot)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Previous justified checkpoint epoch</dt>
				<dd>
					<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
						{#snippet Pending()}
							{@const previousJustifiedCheckpointEpoch = prefetched.previousJustifiedCheckpointEpoch ?? selection.entitySelector.previousJustifiedCheckpointEpoch}
							{#if previousJustifiedCheckpointEpoch !== undefined && previousJustifiedCheckpointEpoch !== null}
								<NumberValue value={Number(previousJustifiedCheckpointEpoch)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const previousJustifiedCheckpointEpoch = entity.previousJustifiedCheckpointEpoch ?? selection.entitySelector.previousJustifiedCheckpointEpoch ?? prefetched.previousJustifiedCheckpointEpoch}
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
					<ResourceBoundary resource={ethereumBeaconFinalityTimestamp}>
						{#snippet Pending()}
							{@const previousJustifiedCheckpointRoot = prefetched.previousJustifiedCheckpointRoot ?? selection.entitySelector.previousJustifiedCheckpointRoot}
							{#if previousJustifiedCheckpointRoot !== undefined && previousJustifiedCheckpointRoot !== null}
								<TruncatedValue value={String(previousJustifiedCheckpointRoot)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const previousJustifiedCheckpointRoot = entity.previousJustifiedCheckpointRoot ?? selection.entitySelector.previousJustifiedCheckpointRoot ?? prefetched.previousJustifiedCheckpointRoot}
							{#if previousJustifiedCheckpointRoot !== undefined && previousJustifiedCheckpointRoot !== null}
								<TruncatedValue value={String(previousJustifiedCheckpointRoot)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
