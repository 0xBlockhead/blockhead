<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplAmm_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.XrplAmm_Timestamp>>
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
	const xrplAmmTimestamp = $derived(selection({}))
	const titleFallback = $derived('XRPL AMM timestamp')
	const viewDomId = $derived('xrpl-amm-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import XrplAmmView from '$/views/XrplAmmView.svelte'
	import XrplLedgerEntryView from '$/views/XrplLedgerEntryView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplAmm_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xrplAmmTimestamp}>
			{#snippet Pending()}
				{title || 'XRPL AMM timestamp'}
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
				<dt>AMM</dt>
				<dd>
					<XrplAmmView
						selection={select(EntityType.XrplAmm, selection.entitySelector.$amm)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ledgerIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const ledgerIndex = selection.entitySelector.ledgerIndex ?? prefetched.ledgerIndex}
							{#if ledgerIndex !== undefined && ledgerIndex !== null}
								{String((ledgerIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const ledgerIndex = resolvedEntity.ledgerIndex}
							{#if ledgerIndex !== undefined && ledgerIndex !== null}
								{String((ledgerIndex) ?? '')}
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const assetAmount = prefetched.assetAmount}
					{#if assetAmount !== undefined && assetAmount !== null}
						<div>
							<dt>asset amount</dt>
							<dd>
								{String((assetAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetAmount = resolvedEntity.assetAmount}
					{#if assetAmount !== undefined && assetAmount !== null}
						<div>
							<dt>asset amount</dt>
							<dd>
								{String((assetAmount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							asset2Amount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const asset2Amount = prefetched.asset2Amount}
					{#if asset2Amount !== undefined && asset2Amount !== null}
						<div>
							<dt>asset2 amount</dt>
							<dd>
								{String((asset2Amount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const asset2Amount = resolvedEntity.asset2Amount}
					{#if asset2Amount !== undefined && asset2Amount !== null}
						<div>
							<dt>asset2 amount</dt>
							<dd>
								{String((asset2Amount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lpTokenBalance: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lpTokenBalance = prefetched.lpTokenBalance}
					{#if lpTokenBalance !== undefined && lpTokenBalance !== null}
						<div>
							<dt>LP token balance</dt>
							<dd>
								{String((lpTokenBalance) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lpTokenBalance = resolvedEntity.lpTokenBalance}
					{#if lpTokenBalance !== undefined && lpTokenBalance !== null}
						<div>
							<dt>LP token balance</dt>
							<dd>
								{String((lpTokenBalance) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tradingFee: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tradingFee = prefetched.tradingFee}
					{#if tradingFee !== undefined && tradingFee !== null}
						<div>
							<dt>trading fee</dt>
							<dd>
								{String((tradingFee) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tradingFee = resolvedEntity.tradingFee}
					{#if tradingFee !== undefined && tradingFee !== null}
						<div>
							<dt>trading fee</dt>
							<dd>
								{String((tradingFee) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.XrplLedgerEntry, false>('$ledgerEntry')}
			>
				{#snippet children(xrplLedgerEntry)}
					{#if xrplLedgerEntry != null && xrplLedgerEntry[EntityMetaKey.Selector] != null}
						<div>
							<dt>ledger entry</dt>
							<dd>
								<XrplLedgerEntryView
									selection={select(EntityType.XrplLedgerEntry, xrplLedgerEntry[EntityMetaKey.Selector])}
									prefetched={xrplLedgerEntry}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
