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
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadActionOutcome>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadActionOutcome>>
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
	const blockheadActionOutcome = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$sessionAction: true,
			outcomeKind: true,
			createdAt: true,
			transactionHash: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.outcomeKind) ?? '')].filter(Boolean).join(' ') || 'blockhead action outcome')
	const viewDomId = $derived('blockhead-action-outcome-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadActionOutcome_TimestampsView from '$/views/BlockheadActionOutcome_TimestampsView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
	import BlockheadWalletRequestView from '$/views/BlockheadWalletRequestView.svelte'
	import BlockheadIntentOrderView from '$/views/BlockheadIntentOrderView.svelte'
	import BlockheadSessionSimulationView from '$/views/BlockheadSessionSimulationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadActionOutcome}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadActionOutcome}>
			{#snippet Pending()}
				{[String((pendingEntity.outcomeKind) ?? '')].filter(Boolean).join(' ') || title || 'blockhead action outcome'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.outcomeKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadActionOutcome}>
			{#snippet Pending()}
				{[String((pendingEntity.transactionHash) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.outcomeKind) ?? '')].filter(Boolean).join(' ') || title || 'blockhead action outcome'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.transactionHash) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.outcomeKind) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadActionOutcome}>
			{#snippet Pending()}
				{@const createdAt0 = pendingEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const createdAt0 = resolvedEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session action</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$sessionAction}
					>
						{#snippet children(blockheadSessionAction)}
							{#if blockheadSessionAction != null && blockheadSessionAction[EntityMetaKey.Selector] != null}
								<BlockheadSessionActionView
									selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
									prefetched={blockheadSessionAction}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>outcome ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									outcomeId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const outcomeId = pendingEntity.outcomeId}
							{#if outcomeId !== undefined && outcomeId !== null}
								{String((outcomeId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const outcomeId = resolvedEntity.outcomeId}
							{#if outcomeId !== undefined && outcomeId !== null}
								{String((outcomeId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>outcome kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									outcomeKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const outcomeKind = pendingEntity.outcomeKind}
							{#if outcomeKind !== undefined && outcomeKind !== null}
								{String((outcomeKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const outcomeKind = resolvedEntity.outcomeKind}
							{#if outcomeKind !== undefined && outcomeKind !== null}
								{String((outcomeKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$walletRequest}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadWalletRequest)}
					{#if blockheadWalletRequest != null && blockheadWalletRequest[EntityMetaKey.Selector] != null}
						<div>
							<dt>wallet request</dt>
							<dd>
								<BlockheadWalletRequestView
									selection={select(EntityType.BlockheadWalletRequest, blockheadWalletRequest[EntityMetaKey.Selector])}
									prefetched={blockheadWalletRequest}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$intentOrder}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadIntentOrder)}
					{#if blockheadIntentOrder != null && blockheadIntentOrder[EntityMetaKey.Selector] != null}
						<div>
							<dt>intent order</dt>
							<dd>
								<BlockheadIntentOrderView
									selection={select(EntityType.BlockheadIntentOrder, blockheadIntentOrder[EntityMetaKey.Selector])}
									prefetched={blockheadIntentOrder}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$simulation}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadSessionSimulation)}
					{#if blockheadSessionSimulation != null && blockheadSessionSimulation[EntityMetaKey.Selector] != null}
						<div>
							<dt>simulation</dt>
							<dd>
								<BlockheadSessionSimulationView
									selection={select(EntityType.BlockheadSessionSimulation, blockheadSessionSimulation[EntityMetaKey.Selector])}
									prefetched={blockheadSessionSimulation}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
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
					{@const transactionHash = pendingEntity.transactionHash}
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
							transactionId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionId = pendingEntity.transactionId}
					{#if transactionId !== undefined && transactionId !== null}
						<div>
							<dt>transaction ID</dt>
							<dd>
								{String((transactionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionId = resolvedEntity.transactionId}
					{#if transactionId !== undefined && transactionId !== null}
						<div>
							<dt>transaction ID</dt>
							<dd>
								{String((transactionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bridgeTransferId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bridgeTransferId = pendingEntity.bridgeTransferId}
					{#if bridgeTransferId !== undefined && bridgeTransferId !== null}
						<div>
							<dt>bridge transfer ID</dt>
							<dd>
								{String((bridgeTransferId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bridgeTransferId = resolvedEntity.bridgeTransferId}
					{#if bridgeTransferId !== undefined && bridgeTransferId !== null}
						<div>
							<dt>bridge transfer ID</dt>
							<dd>
								{String((bridgeTransferId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							outcomePayloadHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const outcomePayloadHash = pendingEntity.outcomePayloadHash}
					{#if outcomePayloadHash !== undefined && outcomePayloadHash !== null}
						<div>
							<dt>outcome payload hash</dt>
							<dd>
								<TruncatedValue value={String((outcomePayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outcomePayloadHash = resolvedEntity.outcomePayloadHash}
					{#if outcomePayloadHash !== undefined && outcomePayloadHash !== null}
						<div>
							<dt>outcome payload hash</dt>
							<dd>
								<TruncatedValue value={String((outcomePayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const createdAt = pendingEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadActionOutcome_TimestampsView
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No outcome observations.'
				id='BlockheadActionOutcome_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
