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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidAccount_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HyperliquidAccount_Timestamp>>
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
	const hyperliquidAccountTimestamp = $derived(selection({}))
	const titleFallback = $derived('hyperliquid account timestamp')
	const viewDomId = $derived('hyperliquid-account-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidAccount_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hyperliquidAccountTimestamp}>
			{#snippet Pending()}
				{title || 'hyperliquid account timestamp'}
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
				<dt>account</dt>
				<dd>
					<HyperliquidAccountView
						selection={select(EntityType.HyperliquidAccount, selection.entitySelector.$account, {})}
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
							{@const source = pendingEntity.source}
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
							accountValue: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountValue = pendingEntity.accountValue}
					{#if accountValue !== undefined && accountValue !== null}
						<div>
							<dt>account value</dt>
							<dd>
								<TruncatedValue value={String((accountValue) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountValue = resolvedEntity.accountValue}
					{#if accountValue !== undefined && accountValue !== null}
						<div>
							<dt>account value</dt>
							<dd>
								<TruncatedValue value={String((accountValue) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalNtlPos: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalNtlPos = pendingEntity.totalNtlPos}
					{#if totalNtlPos !== undefined && totalNtlPos !== null}
						<div>
							<dt>total ntl pos</dt>
							<dd>
								{String((totalNtlPos) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalNtlPos = resolvedEntity.totalNtlPos}
					{#if totalNtlPos !== undefined && totalNtlPos !== null}
						<div>
							<dt>total ntl pos</dt>
							<dd>
								{String((totalNtlPos) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalRawUsd: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalRawUsd = pendingEntity.totalRawUsd}
					{#if totalRawUsd !== undefined && totalRawUsd !== null}
						<div>
							<dt>total raw usd</dt>
							<dd>
								{String((totalRawUsd) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalRawUsd = resolvedEntity.totalRawUsd}
					{#if totalRawUsd !== undefined && totalRawUsd !== null}
						<div>
							<dt>total raw usd</dt>
							<dd>
								{String((totalRawUsd) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalMarginUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalMarginUsed = pendingEntity.totalMarginUsed}
					{#if totalMarginUsed !== undefined && totalMarginUsed !== null}
						<div>
							<dt>total margin used</dt>
							<dd>
								{String((totalMarginUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalMarginUsed = resolvedEntity.totalMarginUsed}
					{#if totalMarginUsed !== undefined && totalMarginUsed !== null}
						<div>
							<dt>total margin used</dt>
							<dd>
								{String((totalMarginUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							withdrawable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const withdrawable = pendingEntity.withdrawable}
					{#if withdrawable !== undefined && withdrawable !== null}
						<div>
							<dt>withdrawable</dt>
							<dd>
								{String((withdrawable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const withdrawable = resolvedEntity.withdrawable}
					{#if withdrawable !== undefined && withdrawable !== null}
						<div>
							<dt>withdrawable</dt>
							<dd>
								{String((withdrawable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							crossMaintenanceMarginUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const crossMaintenanceMarginUsed = pendingEntity.crossMaintenanceMarginUsed}
					{#if crossMaintenanceMarginUsed !== undefined && crossMaintenanceMarginUsed !== null}
						<div>
							<dt>cross maintenance margin used</dt>
							<dd>
								{String((crossMaintenanceMarginUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const crossMaintenanceMarginUsed = resolvedEntity.crossMaintenanceMarginUsed}
					{#if crossMaintenanceMarginUsed !== undefined && crossMaintenanceMarginUsed !== null}
						<div>
							<dt>cross maintenance margin used</dt>
							<dd>
								{String((crossMaintenanceMarginUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
