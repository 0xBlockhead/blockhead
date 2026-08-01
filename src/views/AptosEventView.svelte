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
	}: EntitySelectionViewProps<EntityType.AptosEvent> = $props()

	const aptosEvent = $derived(selection({
		fields: {
			eventType: true,
		},
	}))
	const titleFallback = $derived((prefetched.eventType ?? '') || 'aptos event')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosNetworkView from '$/views/AptosNetworkView.svelte'
	import AptosTransactionView from '$/views/AptosTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosEvent}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aptosEvent}>
			{#snippet children(entity)}
				{entity.eventType || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{[String(selection.entitySelector.transactionVersion), String(selection.entitySelector.eventIndex)].filter(Boolean).join(' ') || (prefetched.eventType ?? '') || titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
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
							<AptosTransactionView
								selection={select(EntityType.AptosTransaction, aptosTransaction[EntityMetaKey.Selector])}
								prefetched={aptosTransaction}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>event type</dt>
				<dd>
					<ResourceBoundary
						resource={aptosEvent}
					>
						{#snippet children(entity)}
							{entity.eventType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transaction version</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.transactionVersion}
					/>
				</dd>
			</div>

			<div>
				<dt>event index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.eventIndex}
					/>
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
						{#snippet children(entity)}
							<TruncatedValue value={entity.accountAddress} />
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
						{#snippet children(entity)}
							<NumberValue
								value={entity.creationNumber}
							/>
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
						{#snippet children(entity)}
							<NumberValue
								value={entity.sequenceNumber}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
