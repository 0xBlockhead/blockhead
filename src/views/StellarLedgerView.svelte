<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.StellarLedger>, 'prefetched'> = $props()

	const stellarLedger = $derived(selection({
		fields: {
			closeTimeMs: true,
			hash: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import StellarTransactionsView from '$/views/StellarTransactionsView.svelte'
	import StellarOperationsView from '$/views/StellarOperationsView.svelte'
	import StellarEffectsView from '$/views/StellarEffectsView.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarLedger}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.sequence)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/ledger/stellar/[sequence=nonNegativeBigInt]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					sequence: String(selection.entitySelector.sequence),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.sequence}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={stellarLedger}>
			{#snippet children(entity)}
				{@const closeTimeMs = entity.closeTimeMs}
				{#if closeTimeMs != null}
					<Timestamp timestamp={closeTimeMs} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={stellarLedger}>
			{#snippet children(entity)}
				{@const hash = entity.hash}
				{#if hash != null}
					<span data-text="muted">
						<TruncatedValue value={hash} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StellarNetworkView
						selection={select(EntityType.StellarNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>sequence</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.sequence}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={stellarLedger}
			>
				{#snippet children(entity)}
					{@const hash = entity.hash}
					{#if hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={hash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={stellarLedger}
			>
				{#snippet children(entity)}
					{@const closeTimeMs = entity.closeTimeMs}
					{#if closeTimeMs != null}
						<div>
							<dt>close time ms</dt>
							<dd>
								<Timestamp timestamp={closeTimeMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							protocolVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const protocolVersion = entity.protocolVersion}
					{#if protocolVersion != null}
						<div>
							<dt>protocol version</dt>
							<dd>
								{protocolVersion}
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
							transactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>transaction count</dt>
							<dd>
								{transactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							operationCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const operationCount = entity.operationCount}
					{#if operationCount != null}
						<div>
							<dt>operation count</dt>
							<dd>
								{operationCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							successfulTransactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const successfulTransactionCount = entity.successfulTransactionCount}
					{#if successfulTransactionCount != null}
						<div>
							<dt>successful transaction count</dt>
							<dd>
								{successfulTransactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							failedTransactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const failedTransactionCount = entity.failedTransactionCount}
					{#if failedTransactionCount != null}
						<div>
							<dt>failed transaction count</dt>
							<dd>
								{failedTransactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const transactionsResource = selection.$$transactions}
		<ResourceBoundary
			resource={transactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<StellarTransactionsView
						selection={transactionsResource}
						countResource={transactionsResource.count}
						title='transactions'
						id='transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const operationsResource = selection.$$operations}
		<ResourceBoundary
			resource={operationsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<StellarOperationsView
						selection={operationsResource}
						countResource={operationsResource.count}
						title='operations'
						id='operations'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const effectsResource = selection.$$effects}
		<ResourceBoundary
			resource={effectsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<StellarEffectsView
						selection={effectsResource}
						countResource={effectsResource.count}
						title='effects'
						id='effects'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
