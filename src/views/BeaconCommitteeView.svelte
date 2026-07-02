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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconCommittee>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BeaconCommittee>>
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

	const beaconCommittee = $derived(selection({
		sources: open ? [
			Source.Beacon_Rest,
		] : undefined,
		fields: {
			...(open && {
				validatorIndices: true,
			}),
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).indexInSlot) ?? '') ? 'Committee #' + String((({ ...selection.entitySelector, ...prefetched }).indexInSlot) ?? '') : '') || 'beacon committee')
	const viewDomId = $derived('beacon-committee-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconCommittee}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).indexInSlot ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]/committee/[index=nonNegativeInteger]', {
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
				<span>Committee </span>
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
			<ResourceBoundary resource={beaconCommittee}>
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
					<ResourceBoundary resource={beaconCommittee}>
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

			<div>
				<dt>Validator indices</dt>
				<dd>
					<ResourceBoundary resource={beaconCommittee}>
						{#snippet Pending()}
							{@const validatorIndices = prefetched.validatorIndices ?? selection.entitySelector.validatorIndices}
							{#if validatorIndices !== undefined && validatorIndices !== null}
								<NumberValue value={Number(validatorIndices)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const validatorIndices = entity.validatorIndices ?? selection.entitySelector.validatorIndices ?? prefetched.validatorIndices}
							{#if validatorIndices !== undefined && validatorIndices !== null}
								<NumberValue value={Number(validatorIndices)} />
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
