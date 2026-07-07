<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.TonJettonTransfer>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonJettonTransfer>>
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
	const tonJettonTransfer = $derived(selection({}))
	const titleFallback = $derived('TON jetton transfer')
	const viewDomId = $derived('ton-jetton-transfer-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonNetworkView from '$/views/TonNetworkView.svelte'
	import TonJettonView from '$/views/TonJettonView.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
	import TonTraceView from '$/views/TonTraceView.svelte'
	import TonMessageView from '$/views/TonMessageView.svelte'
</script>


<EntityView
	entityType={EntityType.TonJettonTransfer}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonJettonTransfer}>
			{#snippet Pending()}
				{title || 'TON jetton transfer'}
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
				<dt>network</dt>
				<dd>
					<TonNetworkView
						selection={select(EntityType.TonNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transfer ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transferId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transferId = selection.entitySelector.transferId ?? prefetched.transferId}
							{#if transferId !== undefined && transferId !== null}
								{String((transferId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transferId = resolvedEntity.transferId}
							{#if transferId !== undefined && transferId !== null}
								{String((transferId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.TonJetton, false>('$jetton')}
			>
				{#snippet children(tonJetton)}
					{#if tonJetton != null && tonJetton[EntityMetaKey.Selector] != null}
						<div>
							<dt>jetton</dt>
							<dd>
								<TonJettonView
									selection={select(EntityType.TonJetton, tonJetton[EntityMetaKey.Selector])}
									prefetched={tonJetton}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.TonAccount, false>('$from')}
			>
				{#snippet children(tonAccount)}
					{#if tonAccount != null && tonAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>from</dt>
							<dd>
								<TonAccountView
									selection={select(EntityType.TonAccount, tonAccount[EntityMetaKey.Selector])}
									prefetched={tonAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.TonAccount, false>('$to')}
			>
				{#snippet children(tonAccount)}
					{#if tonAccount != null && tonAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>to</dt>
							<dd>
								<TonAccountView
									selection={select(EntityType.TonAccount, tonAccount[EntityMetaKey.Selector])}
									prefetched={tonAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.TonTrace, false>('$trace')}
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
				resource={selection[EntityProxyField]<EntityType.TonMessage, false>('$message')}
			>
				{#snippet children(tonMessage)}
					{#if tonMessage != null && tonMessage[EntityMetaKey.Selector] != null}
						<div>
							<dt>message</dt>
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionLt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionLt = prefetched.transactionLt}
					{#if transactionLt !== undefined && transactionLt !== null}
						<div>
							<dt>transaction lt</dt>
							<dd>
								{String((transactionLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionLt = resolvedEntity.transactionLt}
					{#if transactionLt !== undefined && transactionLt !== null}
						<div>
							<dt>transaction lt</dt>
							<dd>
								{String((transactionLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountNano: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountNano = prefetched.amountNano}
					{#if amountNano !== undefined && amountNano !== null}
						<div>
							<dt>amount nano</dt>
							<dd>
								{String((amountNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountNano = resolvedEntity.amountNano}
					{#if amountNano !== undefined && amountNano !== null}
						<div>
							<dt>amount nano</dt>
							<dd>
								{String((amountNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							queryId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const queryId = prefetched.queryId}
					{#if queryId !== undefined && queryId !== null}
						<div>
							<dt>query ID</dt>
							<dd>
								{String((queryId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const queryId = resolvedEntity.queryId}
					{#if queryId !== undefined && queryId !== null}
						<div>
							<dt>query ID</dt>
							<dd>
								{String((queryId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							forwardTonAmountNano: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const forwardTonAmountNano = prefetched.forwardTonAmountNano}
					{#if forwardTonAmountNano !== undefined && forwardTonAmountNano !== null}
						<div>
							<dt>forward TON amount nano</dt>
							<dd>
								{String((forwardTonAmountNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const forwardTonAmountNano = resolvedEntity.forwardTonAmountNano}
					{#if forwardTonAmountNano !== undefined && forwardTonAmountNano !== null}
						<div>
							<dt>forward TON amount nano</dt>
							<dd>
								{String((forwardTonAmountNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							responseDestination: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const responseDestination = prefetched.responseDestination}
					{#if responseDestination !== undefined && responseDestination !== null}
						<div>
							<dt>response destination</dt>
							<dd>
								{String((responseDestination) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const responseDestination = resolvedEntity.responseDestination}
					{#if responseDestination !== undefined && responseDestination !== null}
						<div>
							<dt>response destination</dt>
							<dd>
								{String((responseDestination) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							customPayloadHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const customPayloadHash = prefetched.customPayloadHash}
					{#if customPayloadHash !== undefined && customPayloadHash !== null}
						<div>
							<dt>custom payload hash</dt>
							<dd>
								<TruncatedValue value={String((customPayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const customPayloadHash = resolvedEntity.customPayloadHash}
					{#if customPayloadHash !== undefined && customPayloadHash !== null}
						<div>
							<dt>custom payload hash</dt>
							<dd>
								<TruncatedValue value={String((customPayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
