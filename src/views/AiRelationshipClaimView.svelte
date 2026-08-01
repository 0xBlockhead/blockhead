<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AiRelationshipClaim>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Eip8004Scan_Rest,
			Source.Ipfs_Rest,
		],
	}))
	const titleFallback = $derived(selection.entitySelector.relationshipKind || 'AI relationship claim')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiDocumentView from '$/views/AiDocumentView.svelte'
	import AiDocumentClaimView from '$/views/AiDocumentClaimView.svelte'
</script>


<EntityView
	entityType={EntityType.AiRelationshipClaim}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{[selection.entitySelector.subjectKind, selection.entitySelector.objectKind].filter(Boolean).join(' ') || selection.entitySelector.relationshipKind || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>subject kind</dt>
				<dd>
					{selection.entitySelector.subjectKind}
				</dd>
			</div>

			<div>
				<dt>relationship kind</dt>
				<dd>
					{selection.entitySelector.relationshipKind}
				</dd>
			</div>

			<div>
				<dt>object kind</dt>
				<dd>
					{selection.entitySelector.objectKind}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							confidence: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const confidence = entity.confidence}
					{#if confidence != null}
						<div>
							<dt>confidence</dt>
							<dd>
								<NumberValue
									value={confidence}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$document}
			>
				{#snippet children(aiDocument)}
					{#if aiDocument != null}
						<div>
							<dt>document</dt>
							<dd>
								<AiDocumentView
									selection={select(EntityType.AiDocument, aiDocument[EntityMetaKey.Selector])}
									prefetched={aiDocument}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$documentClaim}
			>
				{#snippet children(aiDocumentClaim)}
					{#if aiDocumentClaim != null}
						<div>
							<dt>document claim</dt>
							<dd>
								<AiDocumentClaimView
									selection={select(EntityType.AiDocumentClaim, aiDocumentClaim[EntityMetaKey.Selector])}
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
				resource={
					viewSelection({
						fields: {
							evidenceUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evidenceUri = entity.evidenceUri}
					{#if evidenceUri != null}
						<div>
							<dt>evidence URI</dt>
							<dd>
								<a
									href={evidenceUri}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={evidenceUri} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							evidenceHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evidenceHashAlgorithm = entity.evidenceHashAlgorithm}
					{#if evidenceHashAlgorithm != null}
						<div>
							<dt>evidence hash algorithm</dt>
							<dd>
								{evidenceHashAlgorithm}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							evidenceHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const evidenceHash = entity.evidenceHash}
					{#if evidenceHash != null}
						<div>
							<dt>evidence hash</dt>
							<dd>
								<TruncatedValue value={evidenceHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
