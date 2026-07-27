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
	}: EntitySelectionViewProps<EntityType.BlockheadCashuMeltQuote_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const blockheadCashuMeltQuoteTimestamp = $derived(selection({
		fields: {
			state: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'blockhead Cashu melt quote timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadCashuMeltQuoteView from '$/views/BlockheadCashuMeltQuoteView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuMeltQuote_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadCashuMeltQuoteTimestamp}>
			{#snippet children(entity)}
				{entity.state || String(pendingEntity.timestampMs) || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{pendingEntity.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>melt quote</dt>
				<dd>
					<BlockheadCashuMeltQuoteView
						selection={select(EntityType.BlockheadCashuMeltQuote, selection.entitySelector.$meltQuote)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<div>
				<dt>state</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadCashuMeltQuoteTimestamp}
					>
						{#snippet children(entity)}
							{entity.state}
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
							expiryMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expiryMs = entity.expiryMs}
					{#if expiryMs != null}
						<div>
							<dt>expiry ms</dt>
							<dd>
								<Timestamp timestamp={Number(expiryMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							paymentPreimage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const paymentPreimage = entity.paymentPreimage}
					{#if paymentPreimage != null}
						<div>
							<dt>payment preimage</dt>
							<dd>
								{paymentPreimage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							subscriptionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const subscriptionId = entity.subscriptionId}
					{#if subscriptionId != null}
						<div>
							<dt>subscription ID</dt>
							<dd>
								{subscriptionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
