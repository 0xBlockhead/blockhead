<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadActionOutcome> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadActionOutcome = $derived(viewSelection({
		fields: {
			outcomeKind: true,
			createdAt: true,
			transactionId: true,
		},
	}))
	const titleFallback = $derived((prefetched.outcomeKind ?? '') || 'blockhead action outcome')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import BlockheadActionOutcome_TimestampsView from '$/views/BlockheadActionOutcome_TimestampsView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
	import BlockheadWalletRequestView from '$/views/BlockheadWalletRequestView.svelte'
	import BlockheadIntentOrderView from '$/views/BlockheadIntentOrderView.svelte'
	import BlockheadSessionSimulationView from '$/views/BlockheadSessionSimulationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadActionOutcome}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/session/[sessionId=stringSegment]/(blockheadSession)/action/[actionId=stringSegment]/(blockheadSessionAction)/outcome/[outcomeId=stringSegment]',
				{
					sessionId: selection.entitySelector.sessionId,
					actionId: selection.entitySelector.actionId,
					outcomeId: selection.entitySelector.outcomeId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadActionOutcome}>
			{#snippet children(entity)}
				{entity.outcomeKind || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadActionOutcome}>
			{#snippet children(entity)}
				{(entity.transactionId ?? '') || entity.outcomeKind || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadActionOutcome}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.createdAt} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>session action</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$sessionAction}
					>
						{#snippet children(blockheadSessionAction)}
							{@const blockheadSessionActionInitial = untrack(() => blockheadSessionAction)}
							<BlockheadSessionActionView
								selection={select(EntityType.BlockheadSessionAction, (blockheadSessionAction ?? blockheadSessionActionInitial)[EntityMetaKey.Selector])}
								prefetched={blockheadSessionAction ?? blockheadSessionActionInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>outcome ID</dt>
				<dd>
					{selection.entitySelector.outcomeId}
				</dd>
			</div>

			<div>
				<dt>outcome kind</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadActionOutcome}
					>
						{#snippet children(entity)}
							{entity.outcomeKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$walletRequest}
			>
				{#snippet children(blockheadWalletRequest)}
					{#if blockheadWalletRequest != null}
						{@const blockheadWalletRequestInitial = untrack(() => blockheadWalletRequest)}
						<div>
							<dt>wallet request</dt>
							<dd>
								<BlockheadWalletRequestView
									selection={select(EntityType.BlockheadWalletRequest, (blockheadWalletRequest ?? blockheadWalletRequestInitial)[EntityMetaKey.Selector])}
									prefetched={blockheadWalletRequest ?? blockheadWalletRequestInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$intentOrder}
			>
				{#snippet children(blockheadIntentOrder)}
					{#if blockheadIntentOrder != null}
						{@const blockheadIntentOrderInitial = untrack(() => blockheadIntentOrder)}
						<div>
							<dt>intent order</dt>
							<dd>
								<BlockheadIntentOrderView
									selection={select(EntityType.BlockheadIntentOrder, (blockheadIntentOrder ?? blockheadIntentOrderInitial)[EntityMetaKey.Selector])}
									prefetched={blockheadIntentOrder ?? blockheadIntentOrderInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$simulation}
			>
				{#snippet children(blockheadSessionSimulation)}
					{#if blockheadSessionSimulation != null}
						{@const blockheadSessionSimulationInitial = untrack(() => blockheadSessionSimulation)}
						<div>
							<dt>simulation</dt>
							<dd>
								<BlockheadSessionSimulationView
									selection={select(EntityType.BlockheadSessionSimulation, (blockheadSessionSimulation ?? blockheadSessionSimulationInitial)[EntityMetaKey.Selector])}
									prefetched={blockheadSessionSimulation ?? blockheadSessionSimulationInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadActionOutcome}
			>
				{#snippet children(entity)}
					{@const transactionId = entity.transactionId}
					{#if transactionId != null}
						<div>
							<dt>transaction ID</dt>
							<dd>
								{transactionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							bridgeTransferId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bridgeTransferId = entity.bridgeTransferId}
					{#if bridgeTransferId != null}
						<div>
							<dt>bridge transfer ID</dt>
							<dd>
								{bridgeTransferId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							outcomePayloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const outcomePayloadHash = entity.outcomePayloadHash}
					{#if outcomePayloadHash != null}
						<div>
							<dt>outcome payload hash</dt>
							<dd>
								<TruncatedValue value={outcomePayloadHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadActionOutcome}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const evmTransactionsResource = selection.$$evmTransactions}
		<ResourceBoundary
			resource={evmTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmTransactionsView
						selection={evmTransactionsResource}
						countResource={evmTransactionsResource.count}
						title='EVM transactions'
						id='evm-transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadActionOutcome_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
