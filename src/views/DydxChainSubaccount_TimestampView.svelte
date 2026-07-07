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
			selection: EntityProxyResource<typeof schema, EntityType.DydxChainSubaccount_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.DydxChainSubaccount_Timestamp>>
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
	const dydxChainSubaccountTimestamp = $derived(selection({
		sources: [
			Source.DydxIndexer_Rest,
			Source.DydxValidator_Rest,
		],
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'dydx chain subaccount timestamp')
	const viewDomId = $derived('dydx-chain-subaccount-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import DydxChainSubaccountView from '$/views/DydxChainSubaccountView.svelte'
</script>


<EntityView
	entityType={EntityType.DydxChainSubaccount_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={dydxChainSubaccountTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={dydxChainSubaccountTimestamp}>
			{#snippet Pending()}
				<DydxChainSubaccountView
					selection={select(EntityType.DydxChainSubaccount, selection.entitySelector.$subaccount)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<DydxChainSubaccountView
					selection={select(EntityType.DydxChainSubaccount, selection.entitySelector.$subaccount)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>subaccount</dt>
				<dd>
					<DydxChainSubaccountView
						selection={select(EntityType.DydxChainSubaccount, selection.entitySelector.$subaccount, {})}
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
							blockHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockHeight = prefetched.blockHeight}
					{#if blockHeight !== undefined && blockHeight !== null}
						<div>
							<dt>block height</dt>
							<dd>
								{String((blockHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockHeight = resolvedEntity.blockHeight}
					{#if blockHeight !== undefined && blockHeight !== null}
						<div>
							<dt>block height</dt>
							<dd>
								{String((blockHeight) ?? '')}
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
							equity: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const equity = prefetched.equity}
					{#if equity !== undefined && equity !== null}
						<div>
							<dt>equity</dt>
							<dd>
								{String((equity) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const equity = resolvedEntity.equity}
					{#if equity !== undefined && equity !== null}
						<div>
							<dt>equity</dt>
							<dd>
								{String((equity) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							freeCollateral: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const freeCollateral = prefetched.freeCollateral}
					{#if freeCollateral !== undefined && freeCollateral !== null}
						<div>
							<dt>free collateral</dt>
							<dd>
								{String((freeCollateral) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const freeCollateral = resolvedEntity.freeCollateral}
					{#if freeCollateral !== undefined && freeCollateral !== null}
						<div>
							<dt>free collateral</dt>
							<dd>
								{String((freeCollateral) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							marginUsage: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const marginUsage = prefetched.marginUsage}
					{#if marginUsage !== undefined && marginUsage !== null}
						<div>
							<dt>margin usage</dt>
							<dd>
								<NumberValue value={Number(marginUsage)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const marginUsage = resolvedEntity.marginUsage}
					{#if marginUsage !== undefined && marginUsage !== null}
						<div>
							<dt>margin usage</dt>
							<dd>
								<NumberValue value={Number(marginUsage)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							openPositionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const openPositionCount = prefetched.openPositionCount}
					{#if openPositionCount !== undefined && openPositionCount !== null}
						<div>
							<dt>open position count</dt>
							<dd>
								<NumberValue value={Number(openPositionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const openPositionCount = resolvedEntity.openPositionCount}
					{#if openPositionCount !== undefined && openPositionCount !== null}
						<div>
							<dt>open position count</dt>
							<dd>
								<NumberValue value={Number(openPositionCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							openOrderCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const openOrderCount = prefetched.openOrderCount}
					{#if openOrderCount !== undefined && openOrderCount !== null}
						<div>
							<dt>open order count</dt>
							<dd>
								<NumberValue value={Number(openOrderCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const openOrderCount = resolvedEntity.openOrderCount}
					{#if openOrderCount !== undefined && openOrderCount !== null}
						<div>
							<dt>open order count</dt>
							<dd>
								<NumberValue value={Number(openOrderCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
