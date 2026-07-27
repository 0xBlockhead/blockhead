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
	}: EntitySelectionViewProps<EntityType.SolanaTransaction_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const solanaTransactionTimestamp = $derived(selection({
		fields: {
			status: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.slot ?? '') || 'solana transaction timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import SolanaTransactionView from '$/views/SolanaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaTransaction_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={pendingEntity.slot}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={solanaTransactionTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || String(pendingEntity.slot) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={solanaTransactionTimestamp}>
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
				<dt>Transaction</dt>
				<dd>
					<SolanaTransactionView
						selection={select(EntityType.SolanaTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
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
								{String(feeLamports)}
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
								{String(computeUnitsConsumed)}
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
