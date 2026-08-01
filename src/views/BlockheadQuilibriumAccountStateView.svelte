<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadQuilibriumAccountState>, 'prefetched'> = $props()

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
	title={title ?? (selection.entitySelector.accountAddress || 'blockhead quilibrium account state')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadQuilibriumAccountState}>
			{#snippet children(entity)}
				{@const accountKind = entity.accountKind}
				{#if accountKind != null}
					<span data-text="muted">
						{accountKind}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					{selection.entitySelector.connectionId}
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
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
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>account address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.accountAddress} />
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
								{accountKind}
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

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadQuilibriumAccountState_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const pendingTransactionsResource = selection.$$pendingTransactions}
		<ResourceBoundary
			resource={pendingTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadQuilibriumPendingTransactionsView
						selection={pendingTransactionsResource}
						countResource={pendingTransactionsResource.count}
						title='pending transactions'
						id='pending-transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
