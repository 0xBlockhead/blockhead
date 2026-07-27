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
	}: EntitySelectionViewProps<EntityType.TonTransaction> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'TON transaction'


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		TON transaction
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<TonAccountView
						selection={select(EntityType.TonAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>lt</dt>
				<dd>
					{String(pendingEntity.lt)}
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.hash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nowMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const nowMs = entity.nowMs}
					{#if nowMs != null}
						<div>
							<dt>now ms</dt>
							<dd>
								{String(nowMs)}
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
				{#snippet children(entity)}
					{@const origStatus = entity.origStatus}
					{#if origStatus != null}
						<div>
							<dt>orig status</dt>
							<dd>
								{origStatus}
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
				{#snippet children(entity)}
					{@const endStatus = entity.endStatus}
					{#if endStatus != null}
						<div>
							<dt>end status</dt>
							<dd>
								{endStatus}
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
				{#snippet children(entity)}
					{@const transactionKind = entity.transactionKind}
					{#if transactionKind != null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{transactionKind}
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
				{#snippet children(entity)}
					{@const outMessageCount = entity.outMessageCount}
					{#if outMessageCount != null}
						<div>
							<dt>out message count</dt>
							<dd>
								{String(outMessageCount)}
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
				{#snippet children(entity)}
					{@const totalFeesNano = entity.totalFeesNano}
					{#if totalFeesNano != null}
						<div>
							<dt>total fees nano</dt>
							<dd>
								{String(totalFeesNano)}
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
							previousTransactionLt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previousTransactionLt = entity.previousTransactionLt}
					{#if previousTransactionLt != null}
						<div>
							<dt>previous transaction lt</dt>
							<dd>
								{String(previousTransactionLt)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(tonBlock)}
					{#if tonBlock != null}
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
					{#if tonTrace != null}
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
					{#if tonMessage != null}
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
