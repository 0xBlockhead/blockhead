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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconSyncCommittee>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BeaconSyncCommittee>>
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
	const beaconSyncCommittee = $derived(selection({}))
	const titleFallback = $derived((String((selection.entitySelector.period ?? prefetched.period) ?? '') ? 'Sync committee #' + String((selection.entitySelector.period ?? prefetched.period) ?? '') : '') || 'beacon sync committee')
	const viewDomId = $derived('beacon-sync-committee-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSyncCommittee}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.period ?? prefetched.period ?? '')}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.period !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/sync-committee/[period=nonNegativeInteger]', {
			caip2: `${String(pendingEntity.$network.caip2.namespace ?? '')}:${String(pendingEntity.$network.caip2.reference ?? '')}`,
			period: String(pendingEntity.period ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = selection.entitySelector.period ?? prefetched.period}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Sync committee </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = selection.entitySelector.period ?? prefetched.period}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={beaconSyncCommittee}>
			{#snippet Pending()}
				<span data-text="muted">
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Period</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									period: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const period = selection.entitySelector.period ?? prefetched.period}
							{#if period !== undefined && period !== null}
								<NumberValue value={Number(period)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const period = resolvedEntity.period}
							{#if period !== undefined && period !== null}
								<NumberValue value={Number(period)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Validator indices</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									validatorIndices: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const validatorIndices = prefetched.validatorIndices}
							{#if validatorIndices !== undefined && validatorIndices !== null}
								<NumberValue value={Number(validatorIndices)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const validatorIndices = resolvedEntity.validatorIndices}
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
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
