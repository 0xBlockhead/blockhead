<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.BlockheadIntentQuote_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadIntentQuoteTimestamp = $derived(viewSelection({
		fields: {
			quoteId: true,
			solverId: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.quoteId ?? '') || (pendingEntity.source ?? '') || 'blockhead intent quote timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadIntentQuoteView from '$/views/BlockheadIntentQuoteView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadIntentQuote_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadIntentQuoteTimestamp}>
			{#snippet children(entity)}
				{(entity.quoteId ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadIntentQuoteTimestamp}>
			{#snippet children(entity)}
				{@const solverId0 = entity.solverId}
				{#if solverId0 != null}
					<span data-text="muted">
						{solverId0}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>quote</dt>
				<dd>
					<BlockheadIntentQuoteView
						selection={select(EntityType.BlockheadIntentQuote, selection.entitySelector.$quote)}
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

			<ResourceBoundary
				resource={blockheadIntentQuoteTimestamp}
			>
				{#snippet children(entity)}
					{@const quoteId = entity.quoteId}
					{#if quoteId != null}
						<div>
							<dt>quote ID</dt>
							<dd>
								{quoteId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadIntentQuoteTimestamp}
			>
				{#snippet children(entity)}
					{@const solverId = entity.solverId}
					{#if solverId != null}
						<div>
							<dt>solver ID</dt>
							<dd>
								{solverId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							validUntil: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const validUntil = entity.validUntil}
					{#if validUntil != null}
						<div>
							<dt>valid until</dt>
							<dd>
								<Timestamp timestamp={Number(validUntil)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							estimatedFillSeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const estimatedFillSeconds = entity.estimatedFillSeconds}
					{#if estimatedFillSeconds != null}
						<div>
							<dt>estimated fill seconds</dt>
							<dd>
								<NumberValue
									value={estimatedFillSeconds}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							quotePayloadHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const quotePayloadHash = entity.quotePayloadHash}
					{#if quotePayloadHash != null}
						<div>
							<dt>quote payload hash</dt>
							<dd>
								<TruncatedValue value={String(quotePayloadHash)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							integrityChecksum: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const integrityChecksum = entity.integrityChecksum}
					{#if integrityChecksum != null}
						<div>
							<dt>integrity checksum</dt>
							<dd>
								{integrityChecksum}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
