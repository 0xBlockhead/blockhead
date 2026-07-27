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
	}: EntitySelectionViewProps<EntityType.XrplLedgerEntry> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'XRPL ledger entry'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import XrplLedgerView from '$/views/XrplLedgerView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplLedgerEntry}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		XRPL ledger entry
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ledger</dt>
				<dd>
					<XrplLedgerView
						selection={select(EntityType.XrplLedger, selection.entitySelector.$ledger)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>entry hash</dt>
				<dd>
					<TruncatedValue value={pendingEntity.entryHash} />
				</dd>
			</div>

			<div>
				<dt>entry type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									entryType: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.entryType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							account: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const account = entity.account}
					{#if account != null}
						<div>
							<dt>account</dt>
							<dd>
								<TruncatedValue value={account} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousTransactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previousTransactionHash = entity.previousTransactionHash}
					{#if previousTransactionHash != null}
						<div>
							<dt>previous transaction hash</dt>
							<dd>
								<TruncatedValue value={previousTransactionHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousTransactionLedgerIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previousTransactionLedgerIndex = entity.previousTransactionLedgerIndex}
					{#if previousTransactionLedgerIndex != null}
						<div>
							<dt>previous transaction ledger index</dt>
							<dd>
								{String(previousTransactionLedgerIndex)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
