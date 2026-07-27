<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.AptosTransaction_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const aptosTransactionTimestamp = $derived(selection({
		fields: {
			success: true,
			vmStatus: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.ledgerVersion ?? '') || 'aptos transaction timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosTransactionView from '$/views/AptosTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosTransaction_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={pendingEntity.ledgerVersion}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosTransactionTimestamp}>
			{#snippet children(entity)}
				{[String(entity.success ?? ''), (entity.vmStatus ?? '')].filter(Boolean).join(' ') || String(pendingEntity.ledgerVersion) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aptosTransactionTimestamp}>
			{#snippet children(entity)}
				{@const timestampMs0 = entity.timestampMs}
				{#if timestampMs0 != null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<AptosTransactionView
						selection={select(EntityType.AptosTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger version</dt>
				<dd>
					<NumberValue
						value={pendingEntity.ledgerVersion}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={aptosTransactionTimestamp}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
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
							blockHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHeight = entity.blockHeight}
					{#if blockHeight != null}
						<div>
							<dt>block height</dt>
							<dd>
								<NumberValue
									value={blockHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aptosTransactionTimestamp}
			>
				{#snippet children(entity)}
					{@const success = entity.success}
					{#if success != null}
						<div>
							<dt>success</dt>
							<dd>
								{success ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aptosTransactionTimestamp}
			>
				{#snippet children(entity)}
					{@const vmStatus = entity.vmStatus}
					{#if vmStatus != null}
						<div>
							<dt>vm status</dt>
							<dd>
								{vmStatus}
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
							gasUnitPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasUnitPrice = entity.gasUnitPrice}
					{#if gasUnitPrice != null}
						<div>
							<dt>gas unit price</dt>
							<dd>
								<NumberValue
									value={gasUnitPrice}
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
							gasUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasUsed = entity.gasUsed}
					{#if gasUsed != null}
						<div>
							<dt>gas used</dt>
							<dd>
								<NumberValue
									value={gasUsed}
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
							accumulatorRootHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const accumulatorRootHash = entity.accumulatorRootHash}
					{#if accumulatorRootHash != null}
						<div>
							<dt>accumulator root hash</dt>
							<dd>
								<TruncatedValue value={accumulatorRootHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
