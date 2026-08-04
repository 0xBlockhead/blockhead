<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadWalletRequest_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadWalletRequestTimestamp = $derived(viewSelection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived((prefetched.status ?? '') || 'blockhead wallet request timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletRequest_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadWalletRequestTimestamp}>
			{#snippet children(entity)}
				{entity.status || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
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
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadWalletRequestTimestamp}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							walletStatusCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const walletStatusCode = entity.walletStatusCode}
					{#if walletStatusCode != null}
						<div>
							<dt>wallet status code</dt>
							<dd>
								<NumberValue
									value={walletStatusCode}
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
					viewSelection({
						fields: {
							atomic: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const atomic = entity.atomic}
					{#if atomic != null}
						<div>
							<dt>atomic</dt>
							<dd>
								{atomic ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							transactionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionId = entity.transactionId}
					{#if transactionId != null}
						<div>
							<dt>transaction ID</dt>
							<dd>
								{transactionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							signatureHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signatureHash = entity.signatureHash}
					{#if signatureHash != null}
						<div>
							<dt>signature hash</dt>
							<dd>
								<TruncatedValue value={signatureHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							statusPayloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const statusPayloadHash = entity.statusPayloadHash}
					{#if statusPayloadHash != null}
						<div>
							<dt>status payload hash</dt>
							<dd>
								<TruncatedValue value={statusPayloadHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const evmTransactionsResource = selection.$$evmTransactions}
		<ResourceBoundary
			resource={evmTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmTransactionsView
						selection={evmTransactionsResource}
						countResource={evmTransactionsResource.count}
						title='EVM transactions'
						id='evm-transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
