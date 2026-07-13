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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const beaconAttestation = $derived(selection({}))
	const titleFallback = $derived((String((pendingEntity.indexInSlot) ?? '') ? 'Attestation #' + String((pendingEntity.indexInSlot) ?? '') : '') || 'beacon attestation')
	const viewDomId = $derived('beacon-attestation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconAttestation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInSlot ?? '')}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.slot !== undefined && pendingEntity.indexInSlot !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/attestation/[index=nonNegativeInteger]', {
			network: String(pendingEntity.$network.slug ?? ''),
			slot: String(pendingEntity.slot ?? ''),
			index: String(pendingEntity.indexInSlot ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.indexInSlot}
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
		{@const serialValue = pendingEntity.indexInSlot}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={beaconAttestation}>
			{#snippet Pending()}
				{@const slot0 = pendingEntity.slot}
				{#if slot0 !== undefined && slot0 !== null}
					<span data-text="muted">
						<span>Slot </span>
						<NumberValue value={Number(slot0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const slot0 = resolvedEntity.slot}
				{#if slot0 !== undefined && slot0 !== null}
					<span data-text="muted">
						<span>Slot </span>
						<NumberValue value={Number(slot0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in slot</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									indexInSlot: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInSlot = pendingEntity.indexInSlot}
							{#if indexInSlot !== undefined && indexInSlot !== null}
								<NumberValue value={Number(indexInSlot)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInSlot = resolvedEntity.indexInSlot}
							{#if indexInSlot !== undefined && indexInSlot !== null}
								<NumberValue value={Number(indexInSlot)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Slot</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									slot: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const slot = pendingEntity.slot}
							{#if slot !== undefined && slot !== null}
								<NumberValue value={Number(slot)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const slot = resolvedEntity.slot}
							{#if slot !== undefined && slot !== null}
								<NumberValue value={Number(slot)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							committeeIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const committeeIndex = pendingEntity.committeeIndex}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const committeeIndex = resolvedEntity.committeeIndex}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							aggregationBits: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const aggregationBits = pendingEntity.aggregationBits}
					{#if aggregationBits !== undefined && aggregationBits !== null}
						<div>
							<dt>Aggregation bits</dt>
							<dd>
								<TruncatedValue value={String((aggregationBits) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const aggregationBits = resolvedEntity.aggregationBits}
					{#if aggregationBits !== undefined && aggregationBits !== null}
						<div>
							<dt>Aggregation bits</dt>
							<dd>
								<TruncatedValue value={String((aggregationBits) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
