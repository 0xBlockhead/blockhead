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
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.XrplLedgerEntry> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import XrplLedgerView from '$/views/XrplLedgerView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplLedgerEntry}
	entitySelector={selection.entitySelector}
	title={title ?? 'XRPL ledger entry'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>ledger</dt>
				<dd>
					<XrplLedgerView
						selection={select(EntityType.XrplLedger, selection.entitySelector.$ledger)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>entry hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.entryHash} />
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
								{previousTransactionLedgerIndex}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
