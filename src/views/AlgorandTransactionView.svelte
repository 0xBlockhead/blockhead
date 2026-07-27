<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
	}: EntitySelectionViewProps<EntityType.AlgorandTransaction> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const algorandTransaction = $derived(selection({
		fields: {
			transactionType: true,
			sender: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.txId ?? '') || 'algorand transaction')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandTransactionProofsView from '$/views/AlgorandTransactionProofsView.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
	import AlgorandTransactionGroupView from '$/views/AlgorandTransactionGroupView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.txId ?? '') || 'algorand transaction'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={algorandTransaction}>
			{#snippet children(entity)}
				{entity.transactionType || pendingEntity.txId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={algorandTransaction}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.sender}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AlgorandNetworkView
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					{pendingEntity.txId}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							round: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const round = entity.round}
					{#if round != null}
						<div>
							<dt>round</dt>
							<dd>
								{String(round)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>sender</dt>
				<dd>
					<ResourceBoundary
						resource={algorandTransaction}
					>
						{#snippet children(entity)}
							{entity.sender}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transaction type</dt>
				<dd>
					<ResourceBoundary
						resource={algorandTransaction}
					>
						{#snippet children(entity)}
							{entity.transactionType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							fee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fee = entity.fee}
					{#if fee != null}
						<div>
							<dt>fee</dt>
							<dd>
								{String(fee)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							group: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const group = entity.group}
					{#if group != null}
						<div>
							<dt>group</dt>
							<dd>
								{String(group)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$group}
			>
				{#snippet children(algorandTransactionGroup)}
					{#if algorandTransactionGroup != null}
						<div>
							<dt>group</dt>
							<dd>
								<AlgorandTransactionGroupView
									selection={select(EntityType.AlgorandTransactionGroup, algorandTransactionGroup[EntityMetaKey.Selector])}
									prefetched={algorandTransactionGroup}
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
							parentTransactionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const parentTransactionId = entity.parentTransactionId}
					{#if parentTransactionId != null}
						<div>
							<dt>parent transaction ID</dt>
							<dd>
								{parentTransactionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							innerTransactionIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const innerTransactionIndex = entity.innerTransactionIndex}
					{#if innerTransactionIndex != null}
						<div>
							<dt>inner transaction index</dt>
							<dd>
								{String(innerTransactionIndex)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>logs</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									logs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.logs.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const algorandTransactionAlgorandTransactionProofsViewProofsResource = selection.$$proofs}
		<ResourceBoundary
			resource={algorandTransactionAlgorandTransactionProofsViewProofsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AlgorandTransactionProofsView
						selection={algorandTransactionAlgorandTransactionProofsViewProofsResource}
						countResource={algorandTransactionAlgorandTransactionProofsViewProofsResource.count}
						title='proofs'
						id='proofs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
