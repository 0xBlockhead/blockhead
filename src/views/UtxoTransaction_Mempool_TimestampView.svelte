<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.UtxoTransaction_Mempool_Timestamp> = $props()

	const utxoTransactionMempoolTimestamp = $derived(selection({
		fields: {
			bip125Replaceable: true,
		},
	}))
	const titleFallback = $derived(String(prefetched.bip125Replaceable ?? '') || 'UTXO transaction mempool observation')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import UtxoTransactionsView from '$/views/UtxoTransactionsView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoTransaction_Mempool_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={utxoTransactionMempoolTimestamp}>
			{#snippet children(entity)}
				{String(entity.bip125Replaceable) || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<UtxoTransactionView
				selection={select(EntityType.UtxoTransaction, selection.entitySelector.$transaction)}
				layout={EntityLayout.Title}
			/>
		</span>

		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Witness transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									witnessTransactionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.witnessTransactionId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>BIP-125 replaceable</dt>
				<dd>
					<ResourceBoundary
						resource={utxoTransactionMempoolTimestamp}
					>
						{#snippet children(entity)}
							{entity.bip125Replaceable ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							unbroadcast: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unbroadcast = entity.unbroadcast}
					{#if unbroadcast != null}
						<div>
							<dt>Unbroadcast</dt>
							<dd>
								{unbroadcast ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Virtual size</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									virtualSizeBytes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.virtualSizeBytes}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Weight</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									weightUnits: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.weightUnits}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Ancestors</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ancestorCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.ancestorCount}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Ancestor size</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ancestorSizeBytes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.ancestorSizeBytes}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Descendants</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									descendantCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.descendantCount}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Descendant size</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									descendantSizeBytes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.descendantSizeBytes}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Base fee</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									baseFeeSats: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.baseFeeSats}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Modified fee</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									modifiedFeeSats: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.modifiedFeeSats}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Ancestor fees</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ancestorFeeSats: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.ancestorFeeSats}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Descendant fees</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									descendantFeeSats: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.descendantFeeSats}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Observed</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Transaction</dt>
				<dd>
					<UtxoTransactionView
						selection={select(EntityType.UtxoTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const dependsOnTransactionsResource = selection.$$dependsOnTransactions}
		<ResourceBoundary
			resource={dependsOnTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<UtxoTransactionsView
						selection={dependsOnTransactionsResource}
						countResource={dependsOnTransactionsResource.count}
						title='Depends on'
						id='depends-on-transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const spentByTransactionsResource = selection.$$spentByTransactions}
		<ResourceBoundary
			resource={spentByTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<UtxoTransactionsView
						selection={spentByTransactionsResource}
						countResource={spentByTransactionsResource.count}
						title='Spent by'
						id='spent-by-transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
