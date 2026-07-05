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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuMeltQuote>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadCashuMeltQuote>>
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
	const blockheadCashuMeltQuote = $derived(selection({
		fields: {
			amount: true,
			unit: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.quoteId ?? prefetched.quoteId) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu melt quote')
	const viewDomId = $derived('blockhead-cashu-melt-quote-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadCashuProofsView from '$/views/BlockheadCashuProofsView.svelte'
	import BlockheadCashuMeltQuote_TimestampsView from '$/views/BlockheadCashuMeltQuote_TimestampsView.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
	import BlockheadCashuWalletStateView from '$/views/BlockheadCashuWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuMeltQuote}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadCashuMeltQuote}>
			{#snippet Pending()}
				{[String((selection.entitySelector.quoteId ?? prefetched.quoteId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead Cashu melt quote'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.quoteId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadCashuMeltQuote}>
			{#snippet Pending()}
				{[String((prefetched.amount) ?? ''), String((prefetched.unit) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.quoteId ?? prefetched.quoteId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead Cashu melt quote'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.amount) ?? ''), String((resolvedEntity.unit) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.quoteId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>mint</dt>
				<dd>
					<CashuMintView
						selection={select(EntityType.CashuMint, selection.entitySelector.$mint)}
						layout={EntityLayout.Title}
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
								fields: {
									method: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const method = selection.entitySelector.method ?? prefetched.method}
							{#if method !== undefined && method !== null}
								{String((method) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									quoteId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const quoteId = selection.entitySelector.quoteId ?? prefetched.quoteId}
							{#if quoteId !== undefined && quoteId !== null}
								{String((quoteId) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									request: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const request = prefetched.request}
							{#if request !== undefined && request !== null}
								{String((request) ?? '')}
							{/if}
						{/snippet}

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
				resource={selection[EntityProxyField]<EntityType.BlockheadCashuWalletState, false>('$walletState')}
			>
				{#snippet children(blockheadCashuWalletState)}
					{#if blockheadCashuWalletState != null && blockheadCashuWalletState[EntityMetaKey.Selector] != null}
						<div>
							<dt>wallet state</dt>
							<dd>
								<BlockheadCashuWalletStateView
									selection={select(EntityType.BlockheadCashuWalletState, blockheadCashuWalletState[EntityMetaKey.Selector])}
									prefetched={blockheadCashuWalletState}
									layout={EntityLayout.Title}
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
						fields: {
							unit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unit = prefetched.unit}
					{#if unit !== undefined && unit !== null}
						<div>
							<dt>unit</dt>
							<dd>
								{String((unit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unit = resolvedEntity.unit}
					{#if unit !== undefined && unit !== null}
						<div>
							<dt>unit</dt>
							<dd>
								{String((unit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amount = prefetched.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								<NumberValue value={Number(amount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amount = resolvedEntity.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								<NumberValue value={Number(amount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeReserve: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeReserve = prefetched.feeReserve}
					{#if feeReserve !== undefined && feeReserve !== null}
						<div>
							<dt>fee reserve</dt>
							<dd>
								<NumberValue value={Number(feeReserve)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeReserve = resolvedEntity.feeReserve}
					{#if feeReserve !== undefined && feeReserve !== null}
						<div>
							<dt>fee reserve</dt>
							<dd>
								<NumberValue value={Number(feeReserve)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadCashuProofsView
				selection={selection[EntityProxyField]<EntityType.BlockheadCashuProof>('$$inputProofs')}
				title='input proofs'
				emptyText='No input proofs found.'
				id='BlockheadCashuProofsView-$$inputProofs'
			/>

			<BlockheadCashuMeltQuote_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadCashuMeltQuote_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No observations yet.'
				id='BlockheadCashuMeltQuote_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
