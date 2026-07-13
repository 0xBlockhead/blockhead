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
			selection: EntityProxyResource<typeof schema, EntityType.FilecoinDeal_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FilecoinDeal_Timestamp>>
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
	const filecoinDealTimestamp = $derived(selection({
		fields: {
			verifiedDeal: true,
			height: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'filecoin deal timestamp')
	const viewDomId = $derived('filecoin-deal-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import FilecoinDealView from '$/views/FilecoinDealView.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinDeal_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={filecoinDealTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
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
		<ResourceBoundary resource={filecoinDealTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.verifiedDeal) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'filecoin deal timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.verifiedDeal) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinDealTimestamp}>
			{#snippet Pending()}
				{@const height0 = pendingEntity.height}
				{#if height0 !== undefined && height0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(height0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const height0 = resolvedEntity.height}
				{#if height0 !== undefined && height0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(height0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Deal</dt>
				<dd>
					<FilecoinDealView
						selection={select(EntityType.FilecoinDeal, selection.entitySelector.$deal, {})}
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
							height: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const height = pendingEntity.height}
					{#if height !== undefined && height !== null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue value={Number(height)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const height = resolvedEntity.height}
					{#if height !== undefined && height !== null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue value={Number(height)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tipsetKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tipsetKey = pendingEntity.tipsetKey}
					{#if tipsetKey !== undefined && tipsetKey !== null}
						<div>
							<dt>Tipset key</dt>
							<dd>
								{String((tipsetKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tipsetKey = resolvedEntity.tipsetKey}
					{#if tipsetKey !== undefined && tipsetKey !== null}
						<div>
							<dt>Tipset key</dt>
							<dd>
								{String((tipsetKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$tipset}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(filecoinTipset)}
					{#if filecoinTipset != null && filecoinTipset[EntityMetaKey.Selector] != null}
						<div>
							<dt>Tipset</dt>
							<dd>
								<FilecoinTipsetView
									selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
									prefetched={filecoinTipset}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sectorStartEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sectorStartEpoch = pendingEntity.sectorStartEpoch}
					{#if sectorStartEpoch !== undefined && sectorStartEpoch !== null}
						<div>
							<dt>Sector start epoch</dt>
							<dd>
								<NumberValue value={Number(sectorStartEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sectorStartEpoch = resolvedEntity.sectorStartEpoch}
					{#if sectorStartEpoch !== undefined && sectorStartEpoch !== null}
						<div>
							<dt>Sector start epoch</dt>
							<dd>
								<NumberValue value={Number(sectorStartEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastUpdatedEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastUpdatedEpoch = pendingEntity.lastUpdatedEpoch}
					{#if lastUpdatedEpoch !== undefined && lastUpdatedEpoch !== null}
						<div>
							<dt>Last updated epoch</dt>
							<dd>
								<NumberValue value={Number(lastUpdatedEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastUpdatedEpoch = resolvedEntity.lastUpdatedEpoch}
					{#if lastUpdatedEpoch !== undefined && lastUpdatedEpoch !== null}
						<div>
							<dt>Last updated epoch</dt>
							<dd>
								<NumberValue value={Number(lastUpdatedEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slashEpoch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const slashEpoch = pendingEntity.slashEpoch}
					{#if slashEpoch !== undefined && slashEpoch !== null}
						<div>
							<dt>Slash epoch</dt>
							<dd>
								<NumberValue value={Number(slashEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slashEpoch = resolvedEntity.slashEpoch}
					{#if slashEpoch !== undefined && slashEpoch !== null}
						<div>
							<dt>Slash epoch</dt>
							<dd>
								<NumberValue value={Number(slashEpoch)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedDeal: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verifiedDeal = pendingEntity.verifiedDeal}
					{#if verifiedDeal !== undefined && verifiedDeal !== null}
						<div>
							<dt>Verified deal</dt>
							<dd>
								{verifiedDeal ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifiedDeal = resolvedEntity.verifiedDeal}
					{#if verifiedDeal !== undefined && verifiedDeal !== null}
						<div>
							<dt>Verified deal</dt>
							<dd>
								{verifiedDeal ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							providerCollateralAttoFil: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerCollateralAttoFil = pendingEntity.providerCollateralAttoFil}
					{#if providerCollateralAttoFil !== undefined && providerCollateralAttoFil !== null}
						<div>
							<dt>Provider collateral attoFIL</dt>
							<dd>
								<NumberValue value={Number(providerCollateralAttoFil)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerCollateralAttoFil = resolvedEntity.providerCollateralAttoFil}
					{#if providerCollateralAttoFil !== undefined && providerCollateralAttoFil !== null}
						<div>
							<dt>Provider collateral attoFIL</dt>
							<dd>
								<NumberValue value={Number(providerCollateralAttoFil)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							clientCollateralAttoFil: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const clientCollateralAttoFil = pendingEntity.clientCollateralAttoFil}
					{#if clientCollateralAttoFil !== undefined && clientCollateralAttoFil !== null}
						<div>
							<dt>Client collateral attoFIL</dt>
							<dd>
								<NumberValue value={Number(clientCollateralAttoFil)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clientCollateralAttoFil = resolvedEntity.clientCollateralAttoFil}
					{#if clientCollateralAttoFil !== undefined && clientCollateralAttoFil !== null}
						<div>
							<dt>Client collateral attoFIL</dt>
							<dd>
								<NumberValue value={Number(clientCollateralAttoFil)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
