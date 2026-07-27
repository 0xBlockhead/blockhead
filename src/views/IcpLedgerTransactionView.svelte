<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.IcpLedgerTransaction> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'ICP ledger transaction'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpLedgerBlockView from '$/views/IcpLedgerBlockView.svelte'
	import IcpLedgerCanisterView from '$/views/IcpLedgerCanisterView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpLedgerTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		ICP ledger transaction
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>block</dt>
				<dd>
					<IcpLedgerBlockView
						selection={select(EntityType.IcpLedgerBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction index</dt>
				<dd>
					{String(pendingEntity.transactionIndex)}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionHash = entity.transactionHash}
					{#if transactionHash != null}
						<div>
							<dt>transaction hash</dt>
							<dd>
								<TruncatedValue value={transactionHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							operationKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const operationKind = entity.operationKind}
					{#if operationKind != null}
						<div>
							<dt>operation kind</dt>
							<dd>
								{operationKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fromAccount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fromAccount = entity.fromAccount}
					{#if fromAccount != null}
						<div>
							<dt>from account</dt>
							<dd>
								<TruncatedValue value={fromAccount} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							toAccount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toAccount = entity.toAccount}
					{#if toAccount != null}
						<div>
							<dt>to account</dt>
							<dd>
								<TruncatedValue value={toAccount} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spenderAccount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spenderAccount = entity.spenderAccount}
					{#if spenderAccount != null}
						<div>
							<dt>spender account</dt>
							<dd>
								<TruncatedValue value={spenderAccount} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amount = entity.amount}
					{#if amount != null}
						<div>
							<dt>amount</dt>
							<dd>
								{String(amount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
								{String(fee)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							memo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const memo = entity.memo}
					{#if memo != null}
						<div>
							<dt>memo</dt>
							<dd>
								{String(memo)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							createdAtTimeNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAtTimeNs = entity.createdAtTimeNs}
					{#if createdAtTimeNs != null}
						<div>
							<dt>created AT time ns</dt>
							<dd>
								{String(createdAtTimeNs)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$ledger}
			>
				{#snippet children(icpLedgerCanister)}
					{#if icpLedgerCanister != null}
						<div>
							<dt>ledger</dt>
							<dd>
								<IcpLedgerCanisterView
									selection={select(EntityType.IcpLedgerCanister, icpLedgerCanister[EntityMetaKey.Selector])}
									prefetched={icpLedgerCanister}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
