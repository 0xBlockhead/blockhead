<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadQuilibriumAccountState>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadQuilibriumAccountState>
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
	const blockheadQuilibriumAccountState = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			accountKind: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			accountKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.accountAddress) ?? '')].filter(Boolean).join(' ') || 'blockhead quilibrium account state')
	const viewDomId = $derived('blockhead-quilibrium-account-state-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.accountAddress) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadQuilibriumAccountState}>
			{#snippet children(entity)}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadQuilibriumAccountState}>
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
								sources: selection.sources,
								fields: {
									connectionId: true,
								},
							})
						}
					>
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
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>account</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$account}
					>
						{#snippet children(quilibriumAccount)}
							{#if quilibriumAccount != null && quilibriumAccount[EntityMetaKey.Selector] != null}
								<QuilibriumAccountView
									selection={select(EntityType.QuilibriumAccount, quilibriumAccount[EntityMetaKey.Selector])}
									prefetched={quilibriumAccount}
									layout={EntityLayout.Value}
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
								sources: selection.sources,
								fields: {
									accountAddress: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							accountKind: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							allowanceAddress: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							signatureKeyAddress: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							keyRingRefCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const keyRingRefCount = resolvedEntity.keyRingRefCount}
					{#if keyRingRefCount !== undefined && keyRingRefCount !== null}
						<div>
							<dt>key ring ref count</dt>
							<dd>
								<NumberValue
									value={keyRingRefCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadQuilibriumAccountStateBlockheadQuilibriumAccountStateTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadQuilibriumAccountStateBlockheadQuilibriumAccountStateTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadQuilibriumAccountState_TimestampsView
					selection={blockheadQuilibriumAccountStateBlockheadQuilibriumAccountStateTimestampsViewTimestampsResource}
					countResource={blockheadQuilibriumAccountStateBlockheadQuilibriumAccountStateTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='BlockheadQuilibriumAccountState_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blockheadQuilibriumAccountStateBlockheadQuilibriumPendingTransactionsViewPendingTransactionsResource = selection.$$pendingTransactions}
		<ResourceBoundary
			resource={blockheadQuilibriumAccountStateBlockheadQuilibriumPendingTransactionsViewPendingTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadQuilibriumPendingTransactionsView
					selection={blockheadQuilibriumAccountStateBlockheadQuilibriumPendingTransactionsViewPendingTransactionsResource}
					countResource={blockheadQuilibriumAccountStateBlockheadQuilibriumPendingTransactionsViewPendingTransactionsResource.count}
					title='pending transactions'
					id='BlockheadQuilibriumPendingTransactionsView-pending-transactions'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
