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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconSlashing>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BeaconSlashing>>
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

	const beaconSlashing = $derived(selection({}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).indexInSlot) ?? '') ? 'Slashing #' + String((({ ...selection.entitySelector, ...prefetched }).indexInSlot) ?? '') : '') || 'beacon slashing')
	const viewDomId = $derived('beacon-slashing-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSlashing}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).indexInSlot ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]/slashing/[kind]/[index=nonNegativeInteger]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).caip2.reference)}`,
			slot: String(({ ...selection.entitySelector, ...prefetched }).slot),
			kind: String(({ ...selection.entitySelector, ...prefetched }).kind),
			index: String(({ ...selection.entitySelector, ...prefetched }).indexInSlot),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{(String((({ ...selection.entitySelector, ...prefetched }).indexInSlot) ?? '') ? 'Slashing #' + String((({ ...selection.entitySelector, ...prefetched }).indexInSlot) ?? '') : '') || title || 'beacon slashing'}
		{:else}
			<ResourceBoundary resource={beaconSlashing}>
				{#snippet Pending()}
					{(String((({ ...selection.entitySelector, ...prefetched }).indexInSlot) ?? '') ? 'Slashing #' + String((({ ...selection.entitySelector, ...prefetched }).indexInSlot) ?? '') : '') || title || 'beacon slashing'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.kind) ?? ''), ' #' + String((entity.indexInSlot) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).kind) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).kind) ?? ''), ' #' + String((({ ...selection.entitySelector, ...prefetched }).indexInSlot) ?? '')].filter(Boolean).join(' ') || title || 'beacon slashing'}
		{:else}
			<ResourceBoundary resource={beaconSlashing}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).kind) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).kind) ?? ''), ' #' + String((({ ...selection.entitySelector, ...prefetched }).indexInSlot) ?? '')].filter(Boolean).join(' ') || title || 'beacon slashing'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.kind) ?? '')].filter(Boolean).join(' ') || [String((entity.kind) ?? ''), ' #' + String((entity.indexInSlot) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
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
			<ResourceBoundary resource={beaconSlashing}>
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
