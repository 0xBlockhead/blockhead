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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AlgorandTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AlgorandTransaction>>
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
	const algorandTransaction = $derived(selection({
		fields: {
			transactionType: true,
			sender: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.txId ?? prefetched.txId) ?? '')].filter(Boolean).join(' ') || 'algorand transaction')
	const viewDomId = $derived('algorand-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AlgorandTransactionProofsView from '$/views/AlgorandTransactionProofsView.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
	import AlgorandTransactionGroupView from '$/views/AlgorandTransactionGroupView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={algorandTransaction}>
			{#snippet Pending()}
				{[String((selection.entitySelector.txId ?? prefetched.txId) ?? '')].filter(Boolean).join(' ') || title || 'algorand transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.txId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={algorandTransaction}>
			{#snippet Pending()}
				{[String((prefetched.transactionType) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.txId ?? prefetched.txId) ?? '')].filter(Boolean).join(' ') || title || 'algorand transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.transactionType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.txId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={algorandTransaction}>
			{#snippet Pending()}
				{@const sender0 = prefetched.sender}
				{#if sender0 !== undefined && sender0 !== null}
					<span data-text="muted">
						{String((sender0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const sender0 = resolvedEntity.sender}
				{#if sender0 !== undefined && sender0 !== null}
					<span data-text="muted">
						{String((sender0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AlgorandNetworkView
						selection={select(EntityType.AlgorandNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									txId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const txId = selection.entitySelector.txId ?? prefetched.txId}
							{#if txId !== undefined && txId !== null}
								{String((txId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const txId = resolvedEntity.txId}
							{#if txId !== undefined && txId !== null}
								{String((txId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							round: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const round = prefetched.round}
					{#if round !== undefined && round !== null}
						<div>
							<dt>round</dt>
							<dd>
								{String((round) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const round = resolvedEntity.round}
					{#if round !== undefined && round !== null}
						<div>
							<dt>round</dt>
							<dd>
								{String((round) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>sender</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sender: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const sender = prefetched.sender}
							{#if sender !== undefined && sender !== null}
								{String((sender) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sender = resolvedEntity.sender}
							{#if sender !== undefined && sender !== null}
								{String((sender) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transaction type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transactionType: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transactionType = prefetched.transactionType}
							{#if transactionType !== undefined && transactionType !== null}
								{String((transactionType) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionType = resolvedEntity.transactionType}
							{#if transactionType !== undefined && transactionType !== null}
								{String((transactionType) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
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
							group: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const group = prefetched.group}
					{#if group !== undefined && group !== null}
						<div>
							<dt>group</dt>
							<dd>
								{String((group) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const group = resolvedEntity.group}
					{#if group !== undefined && group !== null}
						<div>
							<dt>group</dt>
							<dd>
								{String((group) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$group}
			>
				{#snippet children(algorandTransactionGroup)}
					{#if algorandTransactionGroup != null && algorandTransactionGroup[EntityMetaKey.Selector] != null}
						<div>
							<dt>group</dt>
							<dd>
								<AlgorandTransactionGroupView
									selection={select(EntityType.AlgorandTransactionGroup, algorandTransactionGroup[EntityMetaKey.Selector])}
									prefetched={algorandTransactionGroup}
									layout={EntityLayout.Value}
									open={false}
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
							parentTransactionId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const parentTransactionId = prefetched.parentTransactionId}
					{#if parentTransactionId !== undefined && parentTransactionId !== null}
						<div>
							<dt>parent transaction ID</dt>
							<dd>
								{String((parentTransactionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const parentTransactionId = resolvedEntity.parentTransactionId}
					{#if parentTransactionId !== undefined && parentTransactionId !== null}
						<div>
							<dt>parent transaction ID</dt>
							<dd>
								{String((parentTransactionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							innerTransactionIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const innerTransactionIndex = prefetched.innerTransactionIndex}
					{#if innerTransactionIndex !== undefined && innerTransactionIndex !== null}
						<div>
							<dt>inner transaction index</dt>
							<dd>
								{String((innerTransactionIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const innerTransactionIndex = resolvedEntity.innerTransactionIndex}
					{#if innerTransactionIndex !== undefined && innerTransactionIndex !== null}
						<div>
							<dt>inner transaction index</dt>
							<dd>
								{String((innerTransactionIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>logs</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									logs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const logs = prefetched.logs}
							{#if logs !== undefined && logs !== null}
								{logs.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const logs = resolvedEntity.logs}
							{#if logs !== undefined && logs !== null}
								{logs.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AlgorandTransactionProofsView
				selection={selection.$$proofs}
				title='proofs'
				emptyText='No Algorand transaction proofs.'
				id='AlgorandTransactionProofsView-proofs'
			/>
		{/if}
	{/snippet}
</EntityView>
