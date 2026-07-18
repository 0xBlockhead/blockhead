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
			selection: RegisteredEntityProxyResource<EntityType.AiDocumentClaim>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AiDocumentClaim>>
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
	const aiDocumentClaim = $derived(selection({
		sources: selection.sources,
		fields: {
			claimKind: true,
			confidence: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.claimPath) ?? '')].filter(Boolean).join(' ') || 'AI document claim')
	const viewDomId = $derived('ai-document-claim-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AiDocumentView from '$/views/AiDocumentView.svelte'
</script>


<EntityView
	entityType={EntityType.AiDocumentClaim}
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
			{[String((pendingEntity.claimPath) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aiDocumentClaim}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.claimPath) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.claimKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.claimPath) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={aiDocumentClaim}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.claimKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.claimPath) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const confidence0 = pendingEntity.confidence}
			{#if confidence0 !== undefined && confidence0 !== null}
				<span data-text="muted">
					<NumberValue
						value={confidence0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiDocumentClaim}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const confidence0 = resolvedEntity.confidence}
					{#if confidence0 !== undefined && confidence0 !== null}
						<span data-text="muted">
							<NumberValue
								value={confidence0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>document</dt>
				<dd>
					<AiDocumentView
						selection={select(EntityType.AiDocument, selection.entitySelector.$document, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>extractor ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									extractorId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const extractorId = resolvedEntity.extractorId}
							{#if extractorId !== undefined && extractorId !== null}
								{String((extractorId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>claim path</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									claimPath: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const claimPath = resolvedEntity.claimPath}
							{#if claimPath !== undefined && claimPath !== null}
								{String((claimPath) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>claim kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									claimKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const claimKind = resolvedEntity.claimKind}
							{#if claimKind !== undefined && claimKind !== null}
								{String((claimKind) ?? '')}
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
						<div>
							<dt>subject kind</dt>
							<dd>
								{String((subjectKind) ?? '')}
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
							metadataKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metadataKey = resolvedEntity.metadataKey}
					{#if metadataKey !== undefined && metadataKey !== null}
						<div>
							<dt>metadata key</dt>
							<dd>
								{String((metadataKey) ?? '')}
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
							formatObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const formatObjectId = resolvedEntity.formatObjectId}
					{#if formatObjectId !== undefined && formatObjectId !== null}
						<div>
							<dt>format object ID</dt>
							<dd>
								{String((formatObjectId) ?? '')}
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
							formatObjectKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const formatObjectKind = resolvedEntity.formatObjectKind}
					{#if formatObjectKind !== undefined && formatObjectKind !== null}
						<div>
							<dt>format object kind</dt>
							<dd>
								{String((formatObjectKind) ?? '')}
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
							checksumAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const checksumAlgorithm = resolvedEntity.checksumAlgorithm}
					{#if checksumAlgorithm !== undefined && checksumAlgorithm !== null}
						<div>
							<dt>checksum algorithm</dt>
							<dd>
								{String((checksumAlgorithm) ?? '')}
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
							checksumValue: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const checksumValue = resolvedEntity.checksumValue}
					{#if checksumValue !== undefined && checksumValue !== null}
						<div>
							<dt>checksum value</dt>
							<dd>
								{String((checksumValue) ?? '')}
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
							relationshipKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const relationshipKind = resolvedEntity.relationshipKind}
					{#if relationshipKind !== undefined && relationshipKind !== null}
						<div>
							<dt>relationship kind</dt>
							<dd>
								{String((relationshipKind) ?? '')}
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
		</dl>
	{/snippet}
</EntityView>
