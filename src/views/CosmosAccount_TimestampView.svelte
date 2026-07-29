<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.CosmosAccount_Timestamp> = $props()

	const cosmosAccountTimestamp = $derived(selection({
		fields: {
			accountNumber: true,
			sequence: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.source || 'Cosmos account timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CosmosAccountView from '$/views/CosmosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.source || 'Cosmos account timestamp'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cosmosAccountTimestamp}>
			{#snippet children(entity)}
				{[String(entity.accountNumber ?? ''), String(entity.sequence ?? '')].filter(Boolean).join(' ') || selection.entitySelector.source || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={cosmosAccountTimestamp}
			>
				{#snippet children(entity)}
					{@const accountNumber = entity.accountNumber}
					{#if accountNumber != null}
						<div>
							<dt>Account number</dt>
							<dd>
								{accountNumber}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={cosmosAccountTimestamp}
			>
				{#snippet children(entity)}
					{@const sequence = entity.sequence}
					{#if sequence != null}
						<div>
							<dt>Sequence</dt>
							<dd>
								{sequence}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Account</dt>
				<dd>
					<CosmosAccountView
						selection={select(EntityType.CosmosAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
