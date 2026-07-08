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
			selection: EntityProxyResource<typeof schema, EntityType.TonTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonTransaction>>
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
	const tonTransaction = $derived(selection({}))
	const titleFallback = $derived('TON transaction')
	const viewDomId = $derived('ton-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import TonBlockView from '$/views/TonBlockView.svelte'
	import TonTraceView from '$/views/TonTraceView.svelte'
	import TonMessageView from '$/views/TonMessageView.svelte'
</script>


<EntityView
	entityType={EntityType.TonTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonTransaction}>
			{#snippet Pending()}
				{title || 'TON transaction'}
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
				<dt>account</dt>
				<dd>
					<TonAccountView
						selection={select(EntityType.TonAccount, selection.entitySelector.$account, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>lt</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									lt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const lt = selection.entitySelector.lt ?? prefetched.lt}
							{#if lt !== undefined && lt !== null}
								{String((lt) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const lt = resolvedEntity.lt}
							{#if lt !== undefined && lt !== null}
								{String((lt) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							hash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const hash = prefetched.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String((hash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const hash = resolvedEntity.hash}
					{#if hash !== undefined && hash !== null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue value={String((hash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nowMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nowMs = prefetched.nowMs}
					{#if nowMs !== undefined && nowMs !== null}
						<div>
							<dt>now ms</dt>
							<dd>
								{String((nowMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nowMs = resolvedEntity.nowMs}
					{#if nowMs !== undefined && nowMs !== null}
						<div>
							<dt>now ms</dt>
							<dd>
								{String((nowMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							origStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const origStatus = prefetched.origStatus}
					{#if origStatus !== undefined && origStatus !== null}
						<div>
							<dt>orig status</dt>
							<dd>
								{String((origStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const origStatus = resolvedEntity.origStatus}
					{#if origStatus !== undefined && origStatus !== null}
						<div>
							<dt>orig status</dt>
							<dd>
								{String((origStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const endStatus = prefetched.endStatus}
					{#if endStatus !== undefined && endStatus !== null}
						<div>
							<dt>end status</dt>
							<dd>
								{String((endStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endStatus = resolvedEntity.endStatus}
					{#if endStatus !== undefined && endStatus !== null}
						<div>
							<dt>end status</dt>
							<dd>
								{String((endStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionKind = prefetched.transactionKind}
					{#if transactionKind !== undefined && transactionKind !== null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{String((transactionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionKind = resolvedEntity.transactionKind}
					{#if transactionKind !== undefined && transactionKind !== null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{String((transactionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							outMessageCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const outMessageCount = prefetched.outMessageCount}
					{#if outMessageCount !== undefined && outMessageCount !== null}
						<div>
							<dt>out message count</dt>
							<dd>
								{String((outMessageCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outMessageCount = resolvedEntity.outMessageCount}
					{#if outMessageCount !== undefined && outMessageCount !== null}
						<div>
							<dt>out message count</dt>
							<dd>
								{String((outMessageCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalFeesNano: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalFeesNano = prefetched.totalFeesNano}
					{#if totalFeesNano !== undefined && totalFeesNano !== null}
						<div>
							<dt>total fees nano</dt>
							<dd>
								{String((totalFeesNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalFeesNano = resolvedEntity.totalFeesNano}
					{#if totalFeesNano !== undefined && totalFeesNano !== null}
						<div>
							<dt>total fees nano</dt>
							<dd>
								{String((totalFeesNano) ?? '')}
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
				{#snippet Pending()}
					{@const previousTransactionHash = prefetched.previousTransactionHash}
					{#if previousTransactionHash !== undefined && previousTransactionHash !== null}
						<div>
							<dt>previous transaction hash</dt>
							<dd>
								<TruncatedValue value={String((previousTransactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousTransactionHash = resolvedEntity.previousTransactionHash}
					{#if previousTransactionHash !== undefined && previousTransactionHash !== null}
						<div>
							<dt>previous transaction hash</dt>
							<dd>
								<TruncatedValue value={String((previousTransactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousTransactionLt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previousTransactionLt = prefetched.previousTransactionLt}
					{#if previousTransactionLt !== undefined && previousTransactionLt !== null}
						<div>
							<dt>previous transaction lt</dt>
							<dd>
								{String((previousTransactionLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousTransactionLt = resolvedEntity.previousTransactionLt}
					{#if previousTransactionLt !== undefined && previousTransactionLt !== null}
						<div>
							<dt>previous transaction lt</dt>
							<dd>
								{String((previousTransactionLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(tonBlock)}
					{#if tonBlock != null && tonBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>block</dt>
							<dd>
								<TonBlockView
									selection={select(EntityType.TonBlock, tonBlock[EntityMetaKey.Selector])}
									prefetched={tonBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$trace}
			>
				{#snippet children(tonTrace)}
					{#if tonTrace != null && tonTrace[EntityMetaKey.Selector] != null}
						<div>
							<dt>trace</dt>
							<dd>
								<TonTraceView
									selection={select(EntityType.TonTrace, tonTrace[EntityMetaKey.Selector])}
									prefetched={tonTrace}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$inMessage}
			>
				{#snippet children(tonMessage)}
					{#if tonMessage != null && tonMessage[EntityMetaKey.Selector] != null}
						<div>
							<dt>in message</dt>
							<dd>
								<TonMessageView
									selection={select(EntityType.TonMessage, tonMessage[EntityMetaKey.Selector])}
									prefetched={tonMessage}
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
