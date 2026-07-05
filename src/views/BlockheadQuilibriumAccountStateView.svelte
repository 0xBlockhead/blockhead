<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadQuilibriumAccountState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadQuilibriumAccountState>>
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
	const blockheadQuilibriumAccountState = $derived(selection({
		sources: [
			Source.Local_Internal,
			Source.QuilibriumNode_Grpc,
		],
		fields: {
			$account: true,
			accountKind: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.accountAddress ?? prefetched.accountAddress) ?? '')].filter(Boolean).join(' ') || 'blockhead quilibrium account state')
	const viewDomId = $derived('blockhead-quilibrium-account-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadQuilibriumAccountState_TimestampsView from '$/views/BlockheadQuilibriumAccountState_TimestampsView.svelte'
	import BlockheadQuilibriumPendingTransactionsView from '$/views/BlockheadQuilibriumPendingTransactionsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import QuilibriumAccountView from '$/views/QuilibriumAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadQuilibriumAccountState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadQuilibriumAccountState}>
			{#snippet Pending()}
				{[String((selection.entitySelector.accountAddress ?? prefetched.accountAddress) ?? '')].filter(Boolean).join(' ') || title || 'blockhead quilibrium account state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.accountAddress) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadQuilibriumAccountState}>
			{#snippet Pending()}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadQuilibriumAccountState}>
			{#snippet Pending()}
				{@const accountKind0 = prefetched.accountKind}
				{#if accountKind0 !== undefined && accountKind0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((accountKind0) ?? '')} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const accountKind0 = resolvedEntity.accountKind}
				{#if accountKind0 !== undefined && accountKind0 !== null}
					<span data-text="muted">
						<TruncatedValue value={String((accountKind0) ?? '')} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									connectionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const connectionId = selection.entitySelector.connectionId ?? prefetched.connectionId}
							{#if connectionId !== undefined && connectionId !== null}
								{String((connectionId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const connectionId = resolvedEntity.connectionId}
							{#if connectionId !== undefined && connectionId !== null}
								{String((connectionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>account</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.QuilibriumAccount, false>('$account')}
					>
						{#snippet children(quilibriumAccount)}
							{#if quilibriumAccount[EntityMetaKey.Selector] != null}
								<QuilibriumAccountView
									selection={select(EntityType.QuilibriumAccount, quilibriumAccount[EntityMetaKey.Selector])}
									prefetched={quilibriumAccount}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>account address</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									accountAddress: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const accountAddress = selection.entitySelector.accountAddress ?? prefetched.accountAddress}
							{#if accountAddress !== undefined && accountAddress !== null}
								<TruncatedValue value={String((accountAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const accountAddress = resolvedEntity.accountAddress}
							{#if accountAddress !== undefined && accountAddress !== null}
								<TruncatedValue value={String((accountAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accountKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountKind = prefetched.accountKind}
					{#if accountKind !== undefined && accountKind !== null}
						<div>
							<dt>account kind</dt>
							<dd>
								<TruncatedValue value={String((accountKind) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountKind = resolvedEntity.accountKind}
					{#if accountKind !== undefined && accountKind !== null}
						<div>
							<dt>account kind</dt>
							<dd>
								<TruncatedValue value={String((accountKind) ?? '')} />
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
							allowanceAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const allowanceAddress = prefetched.allowanceAddress}
					{#if allowanceAddress !== undefined && allowanceAddress !== null}
						<div>
							<dt>allowance address</dt>
							<dd>
								<TruncatedValue value={String((allowanceAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const allowanceAddress = resolvedEntity.allowanceAddress}
					{#if allowanceAddress !== undefined && allowanceAddress !== null}
						<div>
							<dt>allowance address</dt>
							<dd>
								<TruncatedValue value={String((allowanceAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signatureKeyAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signatureKeyAddress = prefetched.signatureKeyAddress}
					{#if signatureKeyAddress !== undefined && signatureKeyAddress !== null}
						<div>
							<dt>signature key address</dt>
							<dd>
								<TruncatedValue value={String((signatureKeyAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signatureKeyAddress = resolvedEntity.signatureKeyAddress}
					{#if signatureKeyAddress !== undefined && signatureKeyAddress !== null}
						<div>
							<dt>signature key address</dt>
							<dd>
								<TruncatedValue value={String((signatureKeyAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							keyRingRefCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const keyRingRefCount = prefetched.keyRingRefCount}
					{#if keyRingRefCount !== undefined && keyRingRefCount !== null}
						<div>
							<dt>key ring ref count</dt>
							<dd>
								<NumberValue value={Number(keyRingRefCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const keyRingRefCount = resolvedEntity.keyRingRefCount}
					{#if keyRingRefCount !== undefined && keyRingRefCount !== null}
						<div>
							<dt>key ring ref count</dt>
							<dd>
								<NumberValue value={Number(keyRingRefCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadQuilibriumAccountState_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadQuilibriumAccountState_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No Quilibrium account observations.'
				id='BlockheadQuilibriumAccountState_TimestampsView-$$timestamps'
			/>

			<BlockheadQuilibriumPendingTransactionsView
				selection={selection[EntityProxyField]<EntityType.BlockheadQuilibriumPendingTransaction>('$$pendingTransactions')}
				title='pending transactions'
				emptyText='No pending transactions.'
				id='BlockheadQuilibriumPendingTransactionsView-$$pendingTransactions'
			/>
		{/if}
	{/snippet}
</EntityView>
