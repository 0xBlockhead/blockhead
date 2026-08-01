<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SolanaTransaction_Timestamp>, 'prefetched'> = $props()

	const solanaTransactionTimestamp = $derived(selection({
		fields: {
			status: true,
			timestampMs: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTransaction_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.slot)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.slot}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaTransactionTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || String(selection.entitySelector.slot)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaTransactionTimestamp}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<span data-text="muted">
						<Timestamp timestamp={timestampMs} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeLamports: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeLamports = entity.feeLamports}
					{#if feeLamports != null}
						<div>
							<dt>Fee</dt>
							<dd>
								{feeLamports}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							computeUnitsConsumed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const computeUnitsConsumed = entity.computeUnitsConsumed}
					{#if computeUnitsConsumed != null}
						<div>
							<dt>Compute units consumed</dt>
							<dd>
								{computeUnitsConsumed}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							confirmationStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const confirmationStatus = entity.confirmationStatus}
					{#if confirmationStatus != null}
						<div>
							<dt>Confirmation status</dt>
							<dd>
								{confirmationStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
