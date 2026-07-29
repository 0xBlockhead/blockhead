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
	}: EntitySelectionViewProps<EntityType.IcpLedgerAccount_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpLedgerCanisterView from '$/views/IcpLedgerCanisterView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpLedgerAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP ledger account timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		ICP ledger account timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ledger</dt>
				<dd>
					<IcpLedgerCanisterView
						selection={select(EntityType.IcpLedgerCanister, selection.entitySelector.$ledger)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>owner</dt>
				<dd>
					{selection.entitySelector.owner}
				</dd>
			</div>

			<div>
				<dt>subaccount</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.subaccount} />
				</dd>
			</div>

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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							balance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const balance = entity.balance}
					{#if balance != null}
						<div>
							<dt>balance</dt>
							<dd>
								{balance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							allowanceCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const allowanceCount = entity.allowanceCount}
					{#if allowanceCount != null}
						<div>
							<dt>allowance count</dt>
							<dd>
								{allowanceCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
