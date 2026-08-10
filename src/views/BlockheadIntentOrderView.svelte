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
	}: EntitySelectionViewProps<EntityType.BlockheadIntentOrder> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadIntentOrder = $derived(viewSelection({
		fields: {
			source: true,
			orderId: true,
			providerProtocol: true,
			submittedAt: true,
		},
	}))
	const titleFallback = $derived((prefetched.orderId ?? '') || 'blockhead intent order')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadIntentOrder_TimestampsView from '$/views/BlockheadIntentOrder_TimestampsView.svelte'
	import BlockheadIntentQuoteView from '$/views/BlockheadIntentQuoteView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadIntentOrder}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/intent/order/[id=stringSegment]',
				{
					id: selection.entitySelector.id,
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
		<ResourceBoundary resource={blockheadIntentOrder}>
			{#snippet children(entity)}
				{entity.orderId || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadIntentOrder}>
			{#snippet children(entity)}
				{entity.providerProtocol || entity.orderId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadIntentOrder}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.submittedAt} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{selection.entitySelector.id}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadIntentOrder}
					>
						{#snippet children(entity)}
							{entity.source}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>order ID</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadIntentOrder}
					>
						{#snippet children(entity)}
							{entity.orderId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$quote}
			>
				{#snippet children(blockheadIntentQuote)}
					{#if blockheadIntentQuote != null}
						{@const blockheadIntentQuoteInitial = untrack(() => blockheadIntentQuote)}
						<div>
							<dt>quote</dt>
							<dd>
								<BlockheadIntentQuoteView
									selection={select(EntityType.BlockheadIntentQuote, (blockheadIntentQuote ?? blockheadIntentQuoteInitial)[EntityMetaKey.Selector])}
									prefetched={blockheadIntentQuote ?? blockheadIntentQuoteInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$sessionAction}
			>
				{#snippet children(blockheadSessionAction)}
					{#if blockheadSessionAction != null}
						{@const blockheadSessionActionInitial = untrack(() => blockheadSessionAction)}
						<div>
							<dt>session action</dt>
							<dd>
								<BlockheadSessionActionView
									selection={select(EntityType.BlockheadSessionAction, (blockheadSessionAction ?? blockheadSessionActionInitial)[EntityMetaKey.Selector])}
									prefetched={blockheadSessionAction ?? blockheadSessionActionInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>provider protocol</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadIntentOrder}
					>
						{#snippet children(entity)}
							{entity.providerProtocol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>submitted AT</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadIntentOrder}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.submittedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							signatureHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signatureHash = entity.signatureHash}
					{#if signatureHash != null}
						<div>
							<dt>signature hash</dt>
							<dd>
								<TruncatedValue value={signatureHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							orderPayloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const orderPayloadHash = entity.orderPayloadHash}
					{#if orderPayloadHash != null}
						<div>
							<dt>order payload hash</dt>
							<dd>
								<TruncatedValue value={orderPayloadHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadIntentOrder_TimestampsView
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
