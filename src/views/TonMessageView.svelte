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
			selection: EntityProxyResource<typeof schema, EntityType.TonMessage>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonMessage>>
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
	const tonMessage = $derived(selection({}))
	const titleFallback = $derived('TON message')
	const viewDomId = $derived('ton-message-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonNetworkView from '$/views/TonNetworkView.svelte'
	import TonTransactionView from '$/views/TonTransactionView.svelte'
	import TonTraceView from '$/views/TonTraceView.svelte'
</script>


<EntityView
	entityType={EntityType.TonMessage}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonMessage}>
			{#snippet Pending()}
				{title || 'TON message'}
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
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.TonNetwork, false>('$network')}
					>
						{#snippet children(tonNetwork)}
							{#if tonNetwork[EntityMetaKey.Selector] != null}
								<TonNetworkView
									selection={select(EntityType.TonNetwork, tonNetwork[EntityMetaKey.Selector])}
									prefetched={tonNetwork}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							messageHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const messageHash = prefetched.messageHash}
					{#if messageHash !== undefined && messageHash !== null}
						<div>
							<dt>message hash</dt>
							<dd>
								<TruncatedValue value={String((messageHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const messageHash = resolvedEntity.messageHash}
					{#if messageHash !== undefined && messageHash !== null}
						<div>
							<dt>message hash</dt>
							<dd>
								<TruncatedValue value={String((messageHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.TonTransaction, false>('$sourceTransaction')}
			>
				{#snippet children(tonTransaction)}
					{#if tonTransaction != null && tonTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>source transaction</dt>
							<dd>
								<TonTransactionView
									selection={select(EntityType.TonTransaction, tonTransaction[EntityMetaKey.Selector])}
									prefetched={tonTransaction}
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
							outIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const outIndex = prefetched.outIndex}
					{#if outIndex !== undefined && outIndex !== null}
						<div>
							<dt>out index</dt>
							<dd>
								{String((outIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outIndex = resolvedEntity.outIndex}
					{#if outIndex !== undefined && outIndex !== null}
						<div>
							<dt>out index</dt>
							<dd>
								{String((outIndex) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>message kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									messageKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const messageKind = prefetched.messageKind}
							{#if messageKind !== undefined && messageKind !== null}
								{String((messageKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const messageKind = resolvedEntity.messageKind}
							{#if messageKind !== undefined && messageKind !== null}
								{String((messageKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceAddress = prefetched.sourceAddress}
					{#if sourceAddress !== undefined && sourceAddress !== null}
						<div>
							<dt>source address</dt>
							<dd>
								<TruncatedValue value={String((sourceAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceAddress = resolvedEntity.sourceAddress}
					{#if sourceAddress !== undefined && sourceAddress !== null}
						<div>
							<dt>source address</dt>
							<dd>
								<TruncatedValue value={String((sourceAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							destinationAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const destinationAddress = prefetched.destinationAddress}
					{#if destinationAddress !== undefined && destinationAddress !== null}
						<div>
							<dt>destination address</dt>
							<dd>
								<TruncatedValue value={String((destinationAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const destinationAddress = resolvedEntity.destinationAddress}
					{#if destinationAddress !== undefined && destinationAddress !== null}
						<div>
							<dt>destination address</dt>
							<dd>
								<TruncatedValue value={String((destinationAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueNano: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valueNano = prefetched.valueNano}
					{#if valueNano !== undefined && valueNano !== null}
						<div>
							<dt>value nano</dt>
							<dd>
								{String((valueNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueNano = resolvedEntity.valueNano}
					{#if valueNano !== undefined && valueNano !== null}
						<div>
							<dt>value nano</dt>
							<dd>
								{String((valueNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							createdLt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdLt = prefetched.createdLt}
					{#if createdLt !== undefined && createdLt !== null}
						<div>
							<dt>created lt</dt>
							<dd>
								{String((createdLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdLt = resolvedEntity.createdLt}
					{#if createdLt !== undefined && createdLt !== null}
						<div>
							<dt>created lt</dt>
							<dd>
								{String((createdLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ihrDisabled: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ihrDisabled = prefetched.ihrDisabled}
					{#if ihrDisabled !== undefined && ihrDisabled !== null}
						<div>
							<dt>ihr disabled</dt>
							<dd>
								{ihrDisabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ihrDisabled = resolvedEntity.ihrDisabled}
					{#if ihrDisabled !== undefined && ihrDisabled !== null}
						<div>
							<dt>ihr disabled</dt>
							<dd>
								{ihrDisabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bounce: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bounce = prefetched.bounce}
					{#if bounce !== undefined && bounce !== null}
						<div>
							<dt>bounce</dt>
							<dd>
								{bounce ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bounce = resolvedEntity.bounce}
					{#if bounce !== undefined && bounce !== null}
						<div>
							<dt>bounce</dt>
							<dd>
								{bounce ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bounced: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bounced = prefetched.bounced}
					{#if bounced !== undefined && bounced !== null}
						<div>
							<dt>bounced</dt>
							<dd>
								{bounced ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bounced = resolvedEntity.bounced}
					{#if bounced !== undefined && bounced !== null}
						<div>
							<dt>bounced</dt>
							<dd>
								{bounced ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							opcode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const opcode = prefetched.opcode}
					{#if opcode !== undefined && opcode !== null}
						<div>
							<dt>opcode</dt>
							<dd>
								{String((opcode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const opcode = resolvedEntity.opcode}
					{#if opcode !== undefined && opcode !== null}
						<div>
							<dt>opcode</dt>
							<dd>
								{String((opcode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bodyHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bodyHash = prefetched.bodyHash}
					{#if bodyHash !== undefined && bodyHash !== null}
						<div>
							<dt>body hash</dt>
							<dd>
								<TruncatedValue value={String((bodyHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bodyHash = resolvedEntity.bodyHash}
					{#if bodyHash !== undefined && bodyHash !== null}
						<div>
							<dt>body hash</dt>
							<dd>
								<TruncatedValue value={String((bodyHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stateInitHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stateInitHash = prefetched.stateInitHash}
					{#if stateInitHash !== undefined && stateInitHash !== null}
						<div>
							<dt>state init hash</dt>
							<dd>
								<TruncatedValue value={String((stateInitHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stateInitHash = resolvedEntity.stateInitHash}
					{#if stateInitHash !== undefined && stateInitHash !== null}
						<div>
							<dt>state init hash</dt>
							<dd>
								<TruncatedValue value={String((stateInitHash) ?? '')} />
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
				resource={selection[EntityProxyField]<EntityType.TonTransaction, false>('$destinationTransaction')}
			>
				{#snippet children(tonTransaction)}
					{#if tonTransaction != null && tonTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>destination transaction</dt>
							<dd>
								<TonTransactionView
									selection={select(EntityType.TonTransaction, tonTransaction[EntityMetaKey.Selector])}
									prefetched={tonTransaction}
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
