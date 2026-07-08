<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.IcpLedgerTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.IcpLedgerTransaction>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const icpLedgerTransaction = $derived(selection({}))
	const titleFallback = $derived('ICP ledger transaction')
	const viewDomId = $derived('icp-ledger-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpLedgerBlockView from '$/views/IcpLedgerBlockView.svelte'
	import IcpLedgerCanisterView from '$/views/IcpLedgerCanisterView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpLedgerTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={icpLedgerTransaction}>
			{#snippet Pending()}
				{title || 'ICP ledger transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>block</dt>
				<dd>
					<IcpLedgerBlockView
						selection={select(EntityType.IcpLedgerBlock, selection.entitySelector.$block, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transactionIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transactionIndex = selection.entitySelector.transactionIndex ?? prefetched.transactionIndex}
							{#if transactionIndex !== undefined && transactionIndex !== null}
								{String((transactionIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionIndex = resolvedEntity.transactionIndex}
							{#if transactionIndex !== undefined && transactionIndex !== null}
								{String((transactionIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
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
				{#snippet Pending()}
					{@const transactionHash = prefetched.transactionHash}
					{#if transactionHash !== undefined && transactionHash !== null}
						<div>
							<dt>transaction hash</dt>
							<dd>
								<TruncatedValue value={String((transactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionHash = resolvedEntity.transactionHash}
					{#if transactionHash !== undefined && transactionHash !== null}
						<div>
							<dt>transaction hash</dt>
							<dd>
								<TruncatedValue value={String((transactionHash) ?? '')} />
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
				{#snippet Pending()}
					{@const operationKind = prefetched.operationKind}
					{#if operationKind !== undefined && operationKind !== null}
						<div>
							<dt>operation kind</dt>
							<dd>
								{String((operationKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const operationKind = resolvedEntity.operationKind}
					{#if operationKind !== undefined && operationKind !== null}
						<div>
							<dt>operation kind</dt>
							<dd>
								{String((operationKind) ?? '')}
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
				{#snippet Pending()}
					{@const fromAccount = prefetched.fromAccount}
					{#if fromAccount !== undefined && fromAccount !== null}
						<div>
							<dt>from account</dt>
							<dd>
								<TruncatedValue value={String((fromAccount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fromAccount = resolvedEntity.fromAccount}
					{#if fromAccount !== undefined && fromAccount !== null}
						<div>
							<dt>from account</dt>
							<dd>
								<TruncatedValue value={String((fromAccount) ?? '')} />
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
				{#snippet Pending()}
					{@const toAccount = prefetched.toAccount}
					{#if toAccount !== undefined && toAccount !== null}
						<div>
							<dt>to account</dt>
							<dd>
								<TruncatedValue value={String((toAccount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const toAccount = resolvedEntity.toAccount}
					{#if toAccount !== undefined && toAccount !== null}
						<div>
							<dt>to account</dt>
							<dd>
								<TruncatedValue value={String((toAccount) ?? '')} />
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
				{#snippet Pending()}
					{@const spenderAccount = prefetched.spenderAccount}
					{#if spenderAccount !== undefined && spenderAccount !== null}
						<div>
							<dt>spender account</dt>
							<dd>
								<TruncatedValue value={String((spenderAccount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spenderAccount = resolvedEntity.spenderAccount}
					{#if spenderAccount !== undefined && spenderAccount !== null}
						<div>
							<dt>spender account</dt>
							<dd>
								<TruncatedValue value={String((spenderAccount) ?? '')} />
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
				{#snippet Pending()}
					{@const amount = prefetched.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								{String((amount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amount = resolvedEntity.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								{String((amount) ?? '')}
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
				{#snippet Pending()}
					{@const fee = prefetched.fee}
					{#if fee !== undefined && fee !== null}
						<div>
							<dt>fee</dt>
							<dd>
								{String((fee) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fee = resolvedEntity.fee}
					{#if fee !== undefined && fee !== null}
						<div>
							<dt>fee</dt>
							<dd>
								{String((fee) ?? '')}
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
				{#snippet Pending()}
					{@const memo = prefetched.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>memo</dt>
							<dd>
								{String((memo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const memo = resolvedEntity.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>memo</dt>
							<dd>
								{String((memo) ?? '')}
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
				{#snippet Pending()}
					{@const createdAtTimeNs = prefetched.createdAtTimeNs}
					{#if createdAtTimeNs !== undefined && createdAtTimeNs !== null}
						<div>
							<dt>created AT time ns</dt>
							<dd>
								{String((createdAtTimeNs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAtTimeNs = resolvedEntity.createdAtTimeNs}
					{#if createdAtTimeNs !== undefined && createdAtTimeNs !== null}
						<div>
							<dt>created AT time ns</dt>
							<dd>
								{String((createdAtTimeNs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$ledger}
			>
				{#snippet children(icpLedgerCanister)}
					{#if icpLedgerCanister != null && icpLedgerCanister[EntityMetaKey.Selector] != null}
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
