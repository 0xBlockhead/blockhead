<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNetworkExchangeRate_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaNetworkExchangeRate_Timestamp>>
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
	const hederaNetworkExchangeRateTimestamp = $derived(selection({}))
	const titleFallback = $derived('hedera network exchange rate timestamp')
	const viewDomId = $derived('hedera-network-exchange-rate-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HederaNetworkView from '$/views/HederaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNetworkExchangeRate_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaNetworkExchangeRateTimestamp}>
			{#snippet Pending()}
				{title || 'hedera network exchange rate timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<HederaNetworkView
						selection={select(EntityType.HederaNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Title}
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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
						fields: {
							currentRateCentEquivalent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const currentRateCentEquivalent = prefetched.currentRateCentEquivalent}
					{#if currentRateCentEquivalent !== undefined && currentRateCentEquivalent !== null}
						<div>
							<dt>current rate cent equivalent</dt>
							<dd>
								{String((currentRateCentEquivalent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const currentRateCentEquivalent = resolvedEntity.currentRateCentEquivalent}
					{#if currentRateCentEquivalent !== undefined && currentRateCentEquivalent !== null}
						<div>
							<dt>current rate cent equivalent</dt>
							<dd>
								{String((currentRateCentEquivalent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							currentRateHbarEquivalent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const currentRateHbarEquivalent = prefetched.currentRateHbarEquivalent}
					{#if currentRateHbarEquivalent !== undefined && currentRateHbarEquivalent !== null}
						<div>
							<dt>current rate HBAR equivalent</dt>
							<dd>
								{String((currentRateHbarEquivalent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const currentRateHbarEquivalent = resolvedEntity.currentRateHbarEquivalent}
					{#if currentRateHbarEquivalent !== undefined && currentRateHbarEquivalent !== null}
						<div>
							<dt>current rate HBAR equivalent</dt>
							<dd>
								{String((currentRateHbarEquivalent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							currentRateExpirationTime: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const currentRateExpirationTime = prefetched.currentRateExpirationTime}
					{#if currentRateExpirationTime !== undefined && currentRateExpirationTime !== null}
						<div>
							<dt>current rate expiration time</dt>
							<dd>
								{String((currentRateExpirationTime) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const currentRateExpirationTime = resolvedEntity.currentRateExpirationTime}
					{#if currentRateExpirationTime !== undefined && currentRateExpirationTime !== null}
						<div>
							<dt>current rate expiration time</dt>
							<dd>
								{String((currentRateExpirationTime) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nextRateCentEquivalent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nextRateCentEquivalent = prefetched.nextRateCentEquivalent}
					{#if nextRateCentEquivalent !== undefined && nextRateCentEquivalent !== null}
						<div>
							<dt>next rate cent equivalent</dt>
							<dd>
								{String((nextRateCentEquivalent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nextRateCentEquivalent = resolvedEntity.nextRateCentEquivalent}
					{#if nextRateCentEquivalent !== undefined && nextRateCentEquivalent !== null}
						<div>
							<dt>next rate cent equivalent</dt>
							<dd>
								{String((nextRateCentEquivalent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nextRateHbarEquivalent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nextRateHbarEquivalent = prefetched.nextRateHbarEquivalent}
					{#if nextRateHbarEquivalent !== undefined && nextRateHbarEquivalent !== null}
						<div>
							<dt>next rate HBAR equivalent</dt>
							<dd>
								{String((nextRateHbarEquivalent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nextRateHbarEquivalent = resolvedEntity.nextRateHbarEquivalent}
					{#if nextRateHbarEquivalent !== undefined && nextRateHbarEquivalent !== null}
						<div>
							<dt>next rate HBAR equivalent</dt>
							<dd>
								{String((nextRateHbarEquivalent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nextRateExpirationTime: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nextRateExpirationTime = prefetched.nextRateExpirationTime}
					{#if nextRateExpirationTime !== undefined && nextRateExpirationTime !== null}
						<div>
							<dt>next rate expiration time</dt>
							<dd>
								{String((nextRateExpirationTime) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nextRateExpirationTime = resolvedEntity.nextRateExpirationTime}
					{#if nextRateExpirationTime !== undefined && nextRateExpirationTime !== null}
						<div>
							<dt>next rate expiration time</dt>
							<dd>
								{String((nextRateExpirationTime) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
