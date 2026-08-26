<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.IcpLedgerTransaction>, 'prefetched'> = $props()

	const block = $derived(selection.entitySelector.$block)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpLedgerBlockView from '$/views/IcpLedgerBlockView.svelte'
	import IcpLedgerCanisterView from '$/views/IcpLedgerCanisterView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpLedgerTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP ledger transaction'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/ledger/(icpLedgerCanister)/block/[blockIndex=nonNegativeBigInt]/(icpLedgerBlock)/transaction/[transactionIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in block.$ledger.$canister.$network.$network ?
							caip2StringFromValue(block.$ledger.$canister.$network.$network.caip2)
						:
							block.$ledger.$canister.$network.$network.slug
					),
					canisterId: block.$ledger.$canister.canisterId,
					blockIndex: String(block.blockIndex),
					transactionIndex: String(selection.entitySelector.transactionIndex),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>block</dt>
				<dd>
					<IcpLedgerBlockView
						selection={select(EntityType.IcpLedgerBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction index</dt>
				<dd>
					{selection.entitySelector.transactionIndex}
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
								{amount}
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
								{fee}
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
								{memo}
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
								{createdAtTimeNs}
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
						{@const icpLedgerCanisterInitial = untrack(() => icpLedgerCanister)}
						<div>
							<dt>ledger</dt>
							<dd>
								<IcpLedgerCanisterView
									selection={select(EntityType.IcpLedgerCanister, (icpLedgerCanister ?? icpLedgerCanisterInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
