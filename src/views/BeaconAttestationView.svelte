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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconAttestation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BeaconAttestation>>
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

	const beaconAttestation = $derived(selection({
		sources: open ? [
			Source.Beacon_Rest,
		] : undefined,
		fields: {
			...(open && {
				committeeIndex: true,
				aggregationBits: true,
			}),
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).indexInSlot) ?? '') ? 'Attestation #' + String((({ ...selection.entitySelector, ...prefetched }).indexInSlot) ?? '') : '') || 'beacon attestation')
	const viewDomId = $derived('beacon-attestation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconAttestation}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).indexInSlot ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]/attestation/[index=nonNegativeInteger]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).caip2.reference)}`,
			slot: String(({ ...selection.entitySelector, ...prefetched }).slot),
			index: String(({ ...selection.entitySelector, ...prefetched }).indexInSlot),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInSlot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Attestation </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).indexInSlot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const slot0 = prefetched.slot}
			{#if slot0 !== undefined && slot0 !== null}
				<span data-text="muted">
					<span>Slot </span>
					<NumberValue value={Number(slot0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={beaconAttestation}>
				{#snippet Pending()}
					{@const slot0 = prefetched.slot}
					{#if slot0 !== undefined && slot0 !== null}
						<span data-text="muted">
							<span>Slot </span>
							<NumberValue value={Number(slot0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const slot0 = entity.slot}
					{#if slot0 !== undefined && slot0 !== null}
						<span data-text="muted">
							<span>Slot </span>
							<NumberValue value={Number(slot0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in slot</dt>
				<dd>
					<ResourceBoundary resource={beaconAttestation}>
						{#snippet Pending()}
							{@const indexInSlot = prefetched.indexInSlot ?? selection.entitySelector.indexInSlot}
							{#if indexInSlot !== undefined && indexInSlot !== null}
								<NumberValue value={Number(indexInSlot)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const indexInSlot = entity.indexInSlot ?? selection.entitySelector.indexInSlot ?? prefetched.indexInSlot}
							{#if indexInSlot !== undefined && indexInSlot !== null}
								<NumberValue value={Number(indexInSlot)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={beaconAttestation}>
				{#snippet Pending()}
					{@const committeeIndex = prefetched.committeeIndex ?? selection.entitySelector.committeeIndex}
					{#if committeeIndex !== undefined && committeeIndex !== null}
						<div>
							<dt>Committee index</dt>
							<dd>
								<NumberValue value={Number(committeeIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const committeeIndex = entity.committeeIndex ?? selection.entitySelector.committeeIndex ?? prefetched.committeeIndex}
					{#if committeeIndex !== undefined && committeeIndex !== null}
						<div>
							<dt>Committee index</dt>
							<dd>
								<NumberValue value={Number(committeeIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={beaconAttestation}>
				{#snippet Pending()}
					{@const aggregationBits = prefetched.aggregationBits ?? selection.entitySelector.aggregationBits}
					{#if aggregationBits !== undefined && aggregationBits !== null}
						<div>
							<dt>Aggregation bits</dt>
							<dd>
								<TruncatedValue value={String(aggregationBits)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const aggregationBits = entity.aggregationBits ?? selection.entitySelector.aggregationBits ?? prefetched.aggregationBits}
					{#if aggregationBits !== undefined && aggregationBits !== null}
						<div>
							<dt>Aggregation bits</dt>
							<dd>
								<TruncatedValue value={String(aggregationBits)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
