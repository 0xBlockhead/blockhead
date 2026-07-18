<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.XrplAmm_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.XrplAmm_Timestamp>>
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
	const xrplAmmTimestamp = $derived(selection({
		sources: selection.sources,
	}))
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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={xrplAmmTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>AMM</dt>
				<dd>
					<XrplAmmView
						selection={select(EntityType.XrplAmm, selection.entitySelector.$amm, {})}
						href={
							(selection.entitySelector.$amm.ammAccount !== undefined && selection.entitySelector.$amm.$network !== undefined && selection.entitySelector.$amm.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/amm/[ammAccount=stringSegment]', {
								ammAccount: String(selection.entitySelector.$amm.ammAccount ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$amm.$network.caip2) ?? ''),
							}) : selection.entitySelector.$amm.ammAccount !== undefined && selection.entitySelector.$amm.$network !== undefined && selection.entitySelector.$amm.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/amm/[ammAccount=stringSegment]', {
								ammAccount: String(selection.entitySelector.$amm.ammAccount ?? ''),
								network: String(selection.entitySelector.$amm.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
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
								sources: selection.sources,
								fields: {
									ledgerIndex: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							assetAmount: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							asset2Amount: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							lpTokenBalance: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							tradingFee: true,
						},
					})
				}
			>
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
				resource={selection.$ledgerEntry}
			>
				{#snippet children(xrplLedgerEntry)}
					{#if xrplLedgerEntry != null && xrplLedgerEntry[EntityMetaKey.Selector] != null}
						<div>
							<dt>ledger entry</dt>
							<dd>
								<XrplLedgerEntryView
									selection={select(EntityType.XrplLedgerEntry, xrplLedgerEntry[EntityMetaKey.Selector])}
									prefetched={xrplLedgerEntry}
									layout={EntityLayout.Value}
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
