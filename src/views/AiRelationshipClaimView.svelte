<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AiRelationshipClaim>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AiRelationshipClaim>>
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
	const aiRelationshipClaim = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived([String((pendingEntity.relationshipKind) ?? '')].filter(Boolean).join(' ') || 'AI relationship claim')
	const viewDomId = $derived('ai-relationship-claim-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.relationshipKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aiRelationshipClaim}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.relationshipKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.subjectKind) ?? ''), String((pendingEntity.objectKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.relationshipKind) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={aiRelationshipClaim}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.subjectKind) ?? ''), String((resolvedEntity.objectKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.relationshipKind) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(timestampMs0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiRelationshipClaim}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(timestampMs0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>subject kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									subjectKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const subjectKind = resolvedEntity.subjectKind}
							{#if subjectKind !== undefined && subjectKind !== null}
								{String((subjectKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>relationship kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									relationshipKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const relationshipKind = resolvedEntity.relationshipKind}
							{#if relationshipKind !== undefined && relationshipKind !== null}
								{String((relationshipKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>object kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									objectKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const objectKind = resolvedEntity.objectKind}
							{#if objectKind !== undefined && objectKind !== null}
								{String((objectKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							confidence: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const confidence = resolvedEntity.confidence}
					{#if confidence !== undefined && confidence !== null}
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
					{#if aiDocument != null && aiDocument[EntityMetaKey.Selector] != null}
						<div>
							<dt>document</dt>
							<dd>
								<AiDocumentView
									selection={select(EntityType.AiDocument, aiDocument[EntityMetaKey.Selector])}
									prefetched={aiDocument}
									layout={EntityLayout.Value}
									open={false}
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
					{#if aiDocumentClaim != null && aiDocumentClaim[EntityMetaKey.Selector] != null}
						<div>
							<dt>document claim</dt>
							<dd>
								<AiDocumentClaimView
									selection={select(EntityType.AiDocumentClaim, aiDocumentClaim[EntityMetaKey.Selector])}
									prefetched={aiDocumentClaim}
									layout={EntityLayout.Value}
									open={false}
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
					selection({
						sources: selection.sources,
						fields: {
							evidenceUri: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const evidenceUri = resolvedEntity.evidenceUri}
					{#if evidenceUri !== undefined && evidenceUri !== null}
						<div>
							<dt>evidence URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(evidenceUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(evidenceUri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							evidenceHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const evidenceHashAlgorithm = resolvedEntity.evidenceHashAlgorithm}
					{#if evidenceHashAlgorithm !== undefined && evidenceHashAlgorithm !== null}
						<div>
							<dt>evidence hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((evidenceHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							evidenceHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const evidenceHash = resolvedEntity.evidenceHash}
					{#if evidenceHash !== undefined && evidenceHash !== null}
						<div>
							<dt>evidence hash</dt>
							<dd>
								<TruncatedValue value={String((evidenceHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
