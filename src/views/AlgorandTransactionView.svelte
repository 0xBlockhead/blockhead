<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AlgorandTransaction>, 'prefetched'> = $props()

	const algorandTransaction = $derived(selection({
		fields: {
			transactionType: true,
			sender: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.txId || 'algorand transaction')


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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/transaction/[txId=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					txId: selection.entitySelector.txId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={algorandTransaction}>
			{#snippet children(entity)}
				{entity.transactionType || selection.entitySelector.txId || titleFallback}
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

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AlgorandNetworkView
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					{selection.entitySelector.txId}
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
								{round}
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
								{fee}
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
								{group}
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
									layout={EntityLayout.Value}
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
								{innerTransactionIndex}
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
						resource={selection.logs}
					>
						{#snippet children(logs)}
							{logs.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const proofsResource = selection.$$proofs}
		<ResourceBoundary
			resource={proofsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AlgorandTransactionProofsView
						selection={proofsResource}
						countResource={proofsResource.count}
						title='proofs'
						id='proofs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
