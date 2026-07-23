<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.CctpBurnFee_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CctpBurnFee_Timestamp>
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
	const cctpBurnFeeTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'CCTP burn fee timestamp')
	const viewDomId = $derived('cctp-burn-fee-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CctpDomainSupportView from '$/views/CctpDomainSupportView.svelte'
</script>


<EntityView
	entityType={EntityType.CctpBurnFee_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$sourceDomain') && prefetched.$sourceDomain != null && Object.hasOwn(prefetched.$sourceDomain, 'name') && Object.hasOwn(prefetched, '$destinationDomain') && prefetched.$destinationDomain != null && Object.hasOwn(prefetched.$destinationDomain, 'name')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={cctpBurnFeeTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$sourceDomain') && prefetched.$sourceDomain != null && Object.hasOwn(prefetched.$sourceDomain, 'name') && Object.hasOwn(prefetched, '$destinationDomain') && prefetched.$destinationDomain != null && Object.hasOwn(prefetched.$destinationDomain, 'name')}
			{@const cctpDomainSupport0 = pendingEntity.$sourceDomain}
			{#if cctpDomainSupport0 != null && selection.entitySelector.$sourceDomain != null}
				<CctpDomainSupportView
					selection={select(EntityType.CctpDomainSupport, selection.entitySelector.$sourceDomain, { sources: selection.sources })}
					prefetched={cctpDomainSupport0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
			{@const cctpDomainSupport1 = pendingEntity.$destinationDomain}
			{#if cctpDomainSupport1 != null && selection.entitySelector.$destinationDomain != null}
				<CctpDomainSupportView
					selection={select(EntityType.CctpDomainSupport, selection.entitySelector.$destinationDomain, { sources: selection.sources })}
					prefetched={cctpDomainSupport1}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={cctpBurnFeeTimestamp}>
				{#snippet children(entity)}
					<CctpDomainSupportView
						selection={select(EntityType.CctpDomainSupport, selection.entitySelector.$sourceDomain)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>

					<CctpDomainSupportView
						selection={select(EntityType.CctpDomainSupport, selection.entitySelector.$destinationDomain)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$sourceDomain') && prefetched.$sourceDomain != null && Object.hasOwn(prefetched.$sourceDomain, 'name') && Object.hasOwn(prefetched, '$destinationDomain') && prefetched.$destinationDomain != null && Object.hasOwn(prefetched.$destinationDomain, 'name')}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cctpBurnFeeTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source0 = resolvedEntity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Source domain</dt>
				<dd>
					<CctpDomainSupportView
						selection={select(EntityType.CctpDomainSupport, selection.entitySelector.$sourceDomain)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Destination domain</dt>
				<dd>
					<CctpDomainSupportView
						selection={select(EntityType.CctpDomainSupport, selection.entitySelector.$destinationDomain)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

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
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Forward</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									forward: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const forward = resolvedEntity.forward}
							{#if forward !== undefined && forward !== null}
								{forward ? 'Yes' : 'No'}
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
							hyperCoreDeposit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hyperCoreDeposit = resolvedEntity.hyperCoreDeposit}
					{#if hyperCoreDeposit !== undefined && hyperCoreDeposit !== null}
						<div>
							<dt>HyperCore deposit</dt>
							<dd>
								{hyperCoreDeposit ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
