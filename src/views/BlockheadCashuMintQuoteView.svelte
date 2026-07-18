<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadCashuMintQuote>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadCashuMintQuote>>
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
	const blockheadCashuMintQuote = $derived(selection({
		sources: selection.sources,
		fields: {
			amount: true,
			unit: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.quoteId) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu mint quote')
	const viewDomId = $derived('blockhead-cashu-mint-quote-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadCashuMintQuote_TimestampsView from '$/views/BlockheadCashuMintQuote_TimestampsView.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
	import BlockheadCashuWalletStateView from '$/views/BlockheadCashuWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuMintQuote}
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
			{[String((pendingEntity.quoteId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadCashuMintQuote}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.quoteId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const amount0 = pendingEntity.amount}
					{#if amount0 !== undefined && amount0 !== null}
						<NumberValue
							value={amount0}
						/>

						<span>{pendingEntity.unit == null ? '' : ` ${String(pendingEntity.unit)}`}</span>
					{/if}
		{:else}
			<ResourceBoundary resource={blockheadCashuMintQuote}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amount0 = resolvedEntity.amount}
					{#if amount0 !== undefined && amount0 !== null}
						<NumberValue
							value={amount0}
						/>

						<span>{resolvedEntity.unit == null ? '' : ` ${String(resolvedEntity.unit)}`}</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>mint</dt>
				<dd>
					<CashuMintView
						selection={select(EntityType.CashuMint, selection.entitySelector.$mint, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>method</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									method: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const method = resolvedEntity.method}
							{#if method !== undefined && method !== null}
								{String((method) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>quote ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									quoteId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const quoteId = resolvedEntity.quoteId}
							{#if quoteId !== undefined && quoteId !== null}
								{String((quoteId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>request</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									request: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const request = resolvedEntity.request}
							{#if request !== undefined && request !== null}
								{String((request) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$walletState}
			>
				{#snippet children(blockheadCashuWalletState)}
					{#if blockheadCashuWalletState != null && blockheadCashuWalletState[EntityMetaKey.Selector] != null}
						<div>
							<dt>wallet state</dt>
							<dd>
								<BlockheadCashuWalletStateView
									selection={select(EntityType.BlockheadCashuWalletState, blockheadCashuWalletState[EntityMetaKey.Selector])}
									prefetched={blockheadCashuWalletState}
									layout={EntityLayout.Value}
									open={false}
								/>
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
						sources: selection.sources,
						fields: {
							amount: true,
							unit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amount = resolvedEntity.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								<NumberValue
									value={amount}
								/>

								<span>{({ value: amount, ...resolvedEntity }).unit == null ? '' : ` ${String(({ value: amount, ...resolvedEntity }).unit)}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadCashuMintQuote_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No observations yet.'
				id='BlockheadCashuMintQuote_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
