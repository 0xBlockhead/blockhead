<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadQuilibriumPendingTransaction>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadQuilibriumPendingTransaction>>
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
	const blockheadQuilibriumPendingTransaction = $derived(selection({
		sources: [
			Source.Local_Internal,
			Source.QuilibriumNode_Grpc,
		],
		fields: {
			amount: true,
			deliveryType: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.transactionAddress) ?? '')].filter(Boolean).join(' ') || 'blockhead quilibrium pending transaction')
	const viewDomId = $derived('blockhead-quilibrium-pending-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadQuilibriumAccountStateView from '$/views/BlockheadQuilibriumAccountStateView.svelte'
	import QuilibriumAccountView from '$/views/QuilibriumAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadQuilibriumPendingTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadQuilibriumPendingTransaction}>
			{#snippet Pending()}
				{[String((pendingEntity.transactionAddress) ?? '')].filter(Boolean).join(' ') || title || 'blockhead quilibrium pending transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.transactionAddress) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadQuilibriumPendingTransaction}>
			{#snippet Pending()}
				{@const amount0 = pendingEntity.amount}
				{#if amount0 !== undefined && amount0 !== null}
					<NumberValue value={Number(amount0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const amount0 = resolvedEntity.amount}
				{#if amount0 !== undefined && amount0 !== null}
					<NumberValue value={Number(amount0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadQuilibriumPendingTransaction}>
			{#snippet Pending()}
				{@const deliveryType0 = pendingEntity.deliveryType}
				{#if deliveryType0 !== undefined && deliveryType0 !== null}
					<span data-text="muted">
						{String((deliveryType0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const deliveryType0 = resolvedEntity.deliveryType}
				{#if deliveryType0 !== undefined && deliveryType0 !== null}
					<span data-text="muted">
						{String((deliveryType0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account state</dt>
				<dd>
					<BlockheadQuilibriumAccountStateView
						selection={select(EntityType.BlockheadQuilibriumAccountState, selection.entitySelector.$accountState, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transactionAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transactionAddress = pendingEntity.transactionAddress}
							{#if transactionAddress !== undefined && transactionAddress !== null}
								<TruncatedValue value={String((transactionAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionAddress = resolvedEntity.transactionAddress}
							{#if transactionAddress !== undefined && transactionAddress !== null}
								<TruncatedValue value={String((transactionAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(quilibriumAccount)}
					{#if quilibriumAccount != null && quilibriumAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>account</dt>
							<dd>
								<QuilibriumAccountView
									selection={select(EntityType.QuilibriumAccount, quilibriumAccount[EntityMetaKey.Selector])}
									prefetched={quilibriumAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$refundAccount}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(quilibriumAccount)}
					{#if quilibriumAccount != null && quilibriumAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>refund account</dt>
							<dd>
								<QuilibriumAccountView
									selection={select(EntityType.QuilibriumAccount, quilibriumAccount[EntityMetaKey.Selector])}
									prefetched={quilibriumAccount}
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
							coinAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const coinAddress = pendingEntity.coinAddress}
					{#if coinAddress !== undefined && coinAddress !== null}
						<div>
							<dt>coin address</dt>
							<dd>
								<TruncatedValue value={String((coinAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const coinAddress = resolvedEntity.coinAddress}
					{#if coinAddress !== undefined && coinAddress !== null}
						<div>
							<dt>coin address</dt>
							<dd>
								<TruncatedValue value={String((coinAddress) ?? '')} />
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
							amount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amount = pendingEntity.amount}
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
							deliveryType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deliveryType = pendingEntity.deliveryType}
					{#if deliveryType !== undefined && deliveryType !== null}
						<div>
							<dt>delivery type</dt>
							<dd>
								{String((deliveryType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deliveryType = resolvedEntity.deliveryType}
					{#if deliveryType !== undefined && deliveryType !== null}
						<div>
							<dt>delivery type</dt>
							<dd>
								{String((deliveryType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deliveryAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deliveryAddress = pendingEntity.deliveryAddress}
					{#if deliveryAddress !== undefined && deliveryAddress !== null}
						<div>
							<dt>delivery address</dt>
							<dd>
								<TruncatedValue value={String((deliveryAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deliveryAddress = resolvedEntity.deliveryAddress}
					{#if deliveryAddress !== undefined && deliveryAddress !== null}
						<div>
							<dt>delivery address</dt>
							<dd>
								<TruncatedValue value={String((deliveryAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedAt = pendingEntity.observedAt}
					{#if observedAt !== undefined && observedAt !== null}
						<div>
							<dt>observed AT</dt>
							<dd>
								<Timestamp timestamp={Number(observedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedAt = resolvedEntity.observedAt}
					{#if observedAt !== undefined && observedAt !== null}
						<div>
							<dt>observed AT</dt>
							<dd>
								<Timestamp timestamp={Number(observedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
