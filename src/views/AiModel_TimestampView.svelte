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
			selection: RegisteredEntityProxyResource<EntityType.AiModel_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AiModel_Timestamp>>
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
	const aiModelTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			providerDisplayName: true,
			availabilityStatus: true,
			providerLifecycleStatus: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.providerDisplayName) ?? '')].filter(Boolean).join(' ') || 'AI model timestamp')
	const viewDomId = $derived('ai-model-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiModelView from '$/views/AiModelView.svelte'
</script>


<EntityView
	entityType={EntityType.AiModel_Timestamp}
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
			{[String((pendingEntity.providerDisplayName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aiModelTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.providerDisplayName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.availabilityStatus) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.providerDisplayName) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={aiModelTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.availabilityStatus) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.providerDisplayName) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const providerLifecycleStatus0 = pendingEntity.providerLifecycleStatus}
			{#if providerLifecycleStatus0 !== undefined && providerLifecycleStatus0 !== null}
				<span data-text="muted">
					{String((providerLifecycleStatus0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiModelTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerLifecycleStatus0 = resolvedEntity.providerLifecycleStatus}
					{#if providerLifecycleStatus0 !== undefined && providerLifecycleStatus0 !== null}
						<span data-text="muted">
							{String((providerLifecycleStatus0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>model</dt>
				<dd>
					<AiModelView
						selection={select(EntityType.AiModel, selection.entitySelector.$model, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							providerObjectType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerObjectType = resolvedEntity.providerObjectType}
					{#if providerObjectType !== undefined && providerObjectType !== null}
						<div>
							<dt>provider object type</dt>
							<dd>
								{String((providerObjectType) ?? '')}
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
							providerDisplayName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerDisplayName = resolvedEntity.providerDisplayName}
					{#if providerDisplayName !== undefined && providerDisplayName !== null}
						<div>
							<dt>provider display name</dt>
							<dd>
								{String((providerDisplayName) ?? '')}
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
							providerDescription: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerDescription = resolvedEntity.providerDescription}
					{#if providerDescription !== undefined && providerDescription !== null}
						<div>
							<dt>provider description</dt>
							<dd>
								{String((providerDescription) ?? '')}
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
							providerVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerVersion = resolvedEntity.providerVersion}
					{#if providerVersion !== undefined && providerVersion !== null}
						<div>
							<dt>provider version</dt>
							<dd>
								{String((providerVersion) ?? '')}
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
							providerOwnedBy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerOwnedBy = resolvedEntity.providerOwnedBy}
					{#if providerOwnedBy !== undefined && providerOwnedBy !== null}
						<div>
							<dt>provider owned by</dt>
							<dd>
								{String((providerOwnedBy) ?? '')}
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
							availabilityStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const availabilityStatus = resolvedEntity.availabilityStatus}
					{#if availabilityStatus !== undefined && availabilityStatus !== null}
						<div>
							<dt>availability status</dt>
							<dd>
								{String((availabilityStatus) ?? '')}
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
							providerLifecycleStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerLifecycleStatus = resolvedEntity.providerLifecycleStatus}
					{#if providerLifecycleStatus !== undefined && providerLifecycleStatus !== null}
						<div>
							<dt>provider lifecycle status</dt>
							<dd>
								{String((providerLifecycleStatus) ?? '')}
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
							releaseDate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const releaseDate = resolvedEntity.releaseDate}
					{#if releaseDate !== undefined && releaseDate !== null}
						<div>
							<dt>release date</dt>
							<dd>
								<Timestamp timestamp={Number(releaseDate)} />
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
							deprecationDate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deprecationDate = resolvedEntity.deprecationDate}
					{#if deprecationDate !== undefined && deprecationDate !== null}
						<div>
							<dt>deprecation date</dt>
							<dd>
								<Timestamp timestamp={Number(deprecationDate)} />
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
							deprecated: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deprecated = resolvedEntity.deprecated}
					{#if deprecated !== undefined && deprecated !== null}
						<div>
							<dt>deprecated</dt>
							<dd>
								{deprecated ? 'Yes' : 'No'}
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
							deleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deleted = resolvedEntity.deleted}
					{#if deleted !== undefined && deleted !== null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
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
							contextWindowTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contextWindowTokens = resolvedEntity.contextWindowTokens}
					{#if contextWindowTokens !== undefined && contextWindowTokens !== null}
						<div>
							<dt>context window tokens</dt>
							<dd>
								{String((contextWindowTokens) ?? '')}
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
							maxInputTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxInputTokens = resolvedEntity.maxInputTokens}
					{#if maxInputTokens !== undefined && maxInputTokens !== null}
						<div>
							<dt>max input tokens</dt>
							<dd>
								{String((maxInputTokens) ?? '')}
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
							maxOutputTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxOutputTokens = resolvedEntity.maxOutputTokens}
					{#if maxOutputTokens !== undefined && maxOutputTokens !== null}
						<div>
							<dt>max output tokens</dt>
							<dd>
								{String((maxOutputTokens) ?? '')}
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
							supportedToolUse: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const supportedToolUse = resolvedEntity.supportedToolUse}
					{#if supportedToolUse !== undefined && supportedToolUse !== null}
						<div>
							<dt>supported tool use</dt>
							<dd>
								{supportedToolUse ? 'Yes' : 'No'}
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
							supportedStructuredOutput: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const supportedStructuredOutput = resolvedEntity.supportedStructuredOutput}
					{#if supportedStructuredOutput !== undefined && supportedStructuredOutput !== null}
						<div>
							<dt>supported structured output</dt>
							<dd>
								{supportedStructuredOutput ? 'Yes' : 'No'}
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
							supportedJsonMode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const supportedJsonMode = resolvedEntity.supportedJsonMode}
					{#if supportedJsonMode !== undefined && supportedJsonMode !== null}
						<div>
							<dt>supported JSON mode</dt>
							<dd>
								{supportedJsonMode ? 'Yes' : 'No'}
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
							supportedStreaming: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const supportedStreaming = resolvedEntity.supportedStreaming}
					{#if supportedStreaming !== undefined && supportedStreaming !== null}
						<div>
							<dt>supported streaming</dt>
							<dd>
								{supportedStreaming ? 'Yes' : 'No'}
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
							supportedThinking: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const supportedThinking = resolvedEntity.supportedThinking}
					{#if supportedThinking !== undefined && supportedThinking !== null}
						<div>
							<dt>supported thinking</dt>
							<dd>
								{supportedThinking ? 'Yes' : 'No'}
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
							tokenizerUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenizerUrl = resolvedEntity.tokenizerUrl}
					{#if tokenizerUrl !== undefined && tokenizerUrl !== null}
						<div>
							<dt>tokenizer URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(tokenizerUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(tokenizerUrl)} />
								</svelte:element>
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
							inputPricePerMillionTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputPricePerMillionTokens = resolvedEntity.inputPricePerMillionTokens}
					{#if inputPricePerMillionTokens !== undefined && inputPricePerMillionTokens !== null}
						<div>
							<dt>input price per million tokens</dt>
							<dd>
								{String((inputPricePerMillionTokens) ?? '')}
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
							outputPricePerMillionTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outputPricePerMillionTokens = resolvedEntity.outputPricePerMillionTokens}
					{#if outputPricePerMillionTokens !== undefined && outputPricePerMillionTokens !== null}
						<div>
							<dt>output price per million tokens</dt>
							<dd>
								{String((outputPricePerMillionTokens) ?? '')}
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
							cacheReadPricePerMillionTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cacheReadPricePerMillionTokens = resolvedEntity.cacheReadPricePerMillionTokens}
					{#if cacheReadPricePerMillionTokens !== undefined && cacheReadPricePerMillionTokens !== null}
						<div>
							<dt>cache read price per million tokens</dt>
							<dd>
								{String((cacheReadPricePerMillionTokens) ?? '')}
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
							cacheWritePricePerMillionTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cacheWritePricePerMillionTokens = resolvedEntity.cacheWritePricePerMillionTokens}
					{#if cacheWritePricePerMillionTokens !== undefined && cacheWritePricePerMillionTokens !== null}
						<div>
							<dt>cache write price per million tokens</dt>
							<dd>
								{String((cacheWritePricePerMillionTokens) ?? '')}
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
							rateLimitTier: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rateLimitTier = resolvedEntity.rateLimitTier}
					{#if rateLimitTier !== undefined && rateLimitTier !== null}
						<div>
							<dt>rate limit tier</dt>
							<dd>
								{String((rateLimitTier) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
