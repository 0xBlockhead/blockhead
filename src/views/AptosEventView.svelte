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
			selection: EntityProxyResource<typeof schema, EntityType.AptosEvent>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AptosEvent>>
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
	const aptosEvent = $derived(selection({
		fields: {
			eventType: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.eventType) ?? '')].filter(Boolean).join(' ') || 'aptos event')
	const viewDomId = $derived('aptos-event-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosNetworkView from '$/views/AptosNetworkView.svelte'
	import AptosTransactionView from '$/views/AptosTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosEvent}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aptosEvent}>
			{#snippet Pending()}
				{[String((prefetched.eventType) ?? '')].filter(Boolean).join(' ') || title || 'aptos event'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.eventType) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosEvent}>
			{#snippet Pending()}
				{[String((selection.entitySelector.transactionVersion ?? prefetched.transactionVersion) ?? ''), String((selection.entitySelector.eventIndex ?? prefetched.eventIndex) ?? '')].filter(Boolean).join(' ') || [String((prefetched.eventType) ?? '')].filter(Boolean).join(' ') || title || 'aptos event'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.transactionVersion) ?? ''), String((resolvedEntity.eventIndex) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.eventType) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.AptosTransaction, false>('$transaction')}
			>
				{#snippet children(aptosTransaction)}
					{#if aptosTransaction != null && aptosTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<AptosTransactionView
									selection={select(EntityType.AptosTransaction, aptosTransaction[EntityMetaKey.Selector])}
									prefetched={aptosTransaction}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>event type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									eventType: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const eventType = prefetched.eventType}
							{#if eventType !== undefined && eventType !== null}
								{String((eventType) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const eventType = resolvedEntity.eventType}
							{#if eventType !== undefined && eventType !== null}
								{String((eventType) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transaction version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transactionVersion: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transactionVersion = selection.entitySelector.transactionVersion ?? prefetched.transactionVersion}
							{#if transactionVersion !== undefined && transactionVersion !== null}
								<NumberValue value={Number(transactionVersion)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionVersion = resolvedEntity.transactionVersion}
							{#if transactionVersion !== undefined && transactionVersion !== null}
								<NumberValue value={Number(transactionVersion)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>event index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									eventIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const eventIndex = selection.entitySelector.eventIndex ?? prefetched.eventIndex}
							{#if eventIndex !== undefined && eventIndex !== null}
								<NumberValue value={Number(eventIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const eventIndex = resolvedEntity.eventIndex}
							{#if eventIndex !== undefined && eventIndex !== null}
								<NumberValue value={Number(eventIndex)} />
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
							accountAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountAddress = prefetched.accountAddress}
					{#if accountAddress !== undefined && accountAddress !== null}
						<div>
							<dt>account address</dt>
							<dd>
								<TruncatedValue value={String((accountAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountAddress = resolvedEntity.accountAddress}
					{#if accountAddress !== undefined && accountAddress !== null}
						<div>
							<dt>account address</dt>
							<dd>
								<TruncatedValue value={String((accountAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							creationNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const creationNumber = prefetched.creationNumber}
					{#if creationNumber !== undefined && creationNumber !== null}
						<div>
							<dt>creation number</dt>
							<dd>
								<NumberValue value={Number(creationNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const creationNumber = resolvedEntity.creationNumber}
					{#if creationNumber !== undefined && creationNumber !== null}
						<div>
							<dt>creation number</dt>
							<dd>
								<NumberValue value={Number(creationNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sequenceNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sequenceNumber = prefetched.sequenceNumber}
					{#if sequenceNumber !== undefined && sequenceNumber !== null}
						<div>
							<dt>sequence number</dt>
							<dd>
								<NumberValue value={Number(sequenceNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sequenceNumber = resolvedEntity.sequenceNumber}
					{#if sequenceNumber !== undefined && sequenceNumber !== null}
						<div>
							<dt>sequence number</dt>
							<dd>
								<NumberValue value={Number(sequenceNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
