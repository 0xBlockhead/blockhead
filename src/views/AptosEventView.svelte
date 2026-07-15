<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AptosEvent>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AptosEvent>>
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
	const titleFallback = $derived([String((pendingEntity.eventType) ?? '')].filter(Boolean).join(' ') || 'aptos event')
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
				{[String((pendingEntity.eventType) ?? '')].filter(Boolean).join(' ') || title || 'aptos event'}
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
				{[String((pendingEntity.transactionVersion) ?? ''), String((pendingEntity.eventIndex) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.eventType) ?? '')].filter(Boolean).join(' ') || title || 'aptos event'}
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
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$transaction}
					>
						{#snippet children(aptosTransaction)}
							{#if aptosTransaction != null && aptosTransaction[EntityMetaKey.Selector] != null}
								<AptosTransactionView
									selection={select(EntityType.AptosTransaction, aptosTransaction[EntityMetaKey.Selector])}
									prefetched={aptosTransaction}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
							{@const eventType = pendingEntity.eventType}
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
							{@const transactionVersion = pendingEntity.transactionVersion}
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
							{@const eventIndex = pendingEntity.eventIndex}
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
			<div>
				<dt>account address</dt>
				<dd>
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
							{@const accountAddress = pendingEntity.accountAddress}
							{#if accountAddress !== undefined && accountAddress !== null}
								<TruncatedValue value={String((accountAddress) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const accountAddress = resolvedEntity.accountAddress}
							{#if accountAddress !== undefined && accountAddress !== null}
								<TruncatedValue value={String((accountAddress) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>creation number</dt>
				<dd>
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
							{@const creationNumber = pendingEntity.creationNumber}
							{#if creationNumber !== undefined && creationNumber !== null}
								<NumberValue value={Number(creationNumber)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const creationNumber = resolvedEntity.creationNumber}
							{#if creationNumber !== undefined && creationNumber !== null}
								<NumberValue value={Number(creationNumber)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>sequence number</dt>
				<dd>
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
							{@const sequenceNumber = pendingEntity.sequenceNumber}
							{#if sequenceNumber !== undefined && sequenceNumber !== null}
								<NumberValue value={Number(sequenceNumber)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sequenceNumber = resolvedEntity.sequenceNumber}
							{#if sequenceNumber !== undefined && sequenceNumber !== null}
								<NumberValue value={Number(sequenceNumber)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
