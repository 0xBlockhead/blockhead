<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadQuilibriumAccountState> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.QuilibriumNode_Grpc,
		],
	}))
	const blockheadQuilibriumAccountState = $derived(viewSelection({
		fields: {
			accountKind: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.accountAddress ?? '') || 'blockhead quilibrium account state')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.accountAddress ?? '') || 'blockhead quilibrium account state'}
	{/snippet}

	{#snippet Value()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadQuilibriumAccountState}>
			{#snippet children(entity)}
				{@const accountKind0 = entity.accountKind}
				{#if accountKind0 != null}
					<span data-text="muted">
						<TruncatedValue value={accountKind0} />
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
					{pendingEntity.connectionId}
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
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
							<QuilibriumAccountView
								selection={select(EntityType.QuilibriumAccount, quilibriumAccount[EntityMetaKey.Selector])}
								prefetched={quilibriumAccount}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>account address</dt>
				<dd>
					<TruncatedValue value={pendingEntity.accountAddress} />
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadQuilibriumAccountState}
			>
				{#snippet children(entity)}
					{@const accountKind = entity.accountKind}
					{#if accountKind != null}
						<div>
							<dt>account kind</dt>
							<dd>
								<TruncatedValue value={accountKind} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							allowanceAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const allowanceAddress = entity.allowanceAddress}
					{#if allowanceAddress != null}
						<div>
							<dt>allowance address</dt>
							<dd>
								<TruncatedValue value={allowanceAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							signatureKeyAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signatureKeyAddress = entity.signatureKeyAddress}
					{#if signatureKeyAddress != null}
						<div>
							<dt>signature key address</dt>
							<dd>
								<TruncatedValue value={signatureKeyAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							keyRingRefCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const keyRingRefCount = entity.keyRingRefCount}
					{#if keyRingRefCount != null}
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
						id='timestamps'
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
						id='pending-transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
