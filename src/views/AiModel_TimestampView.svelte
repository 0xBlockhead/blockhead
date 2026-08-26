<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AiModel_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Anthropic_Rest,
			Source.OpenAI_Rest,
		],
	}))
	const aiModelTimestamp = $derived(viewSelection({
		fields: {
			providerDisplayName: true,
			availabilityStatus: true,
			providerLifecycleStatus: true,
		},
	}))
	const titleFallback = $derived((prefetched.providerDisplayName ?? '') || 'AI model timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiModelView from '$/views/AiModelView.svelte'
</script>


<EntityView
	entityType={EntityType.AiModel_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aiModelTimestamp}>
			{#snippet children(entity)}
				{(entity.providerDisplayName ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiModelTimestamp}>
			{#snippet children(entity)}
				{(entity.availabilityStatus ?? '') || (entity.providerDisplayName ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiModelTimestamp}>
			{#snippet children(entity)}
				{@const providerLifecycleStatus = entity.providerLifecycleStatus}
				{#if providerLifecycleStatus != null}
					<span data-text="muted">
						{providerLifecycleStatus}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>model</dt>
				<dd>
					<AiModelView
						selection={select(EntityType.AiModel, selection.entitySelector.$model)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							providerObjectType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerObjectType = entity.providerObjectType}
					{#if providerObjectType != null}
						<div>
							<dt>provider object type</dt>
							<dd>
								{providerObjectType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiModelTimestamp}
			>
				{#snippet children(entity)}
					{@const providerDisplayName = entity.providerDisplayName}
					{#if providerDisplayName != null}
						<div>
							<dt>provider display name</dt>
							<dd>
								{providerDisplayName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							providerDescription: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerDescription = entity.providerDescription}
					{#if providerDescription != null}
						<div>
							<dt>provider description</dt>
							<dd>
								{providerDescription}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							providerVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerVersion = entity.providerVersion}
					{#if providerVersion != null}
						<div>
							<dt>provider version</dt>
							<dd>
								{providerVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							providerOwnedBy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerOwnedBy = entity.providerOwnedBy}
					{#if providerOwnedBy != null}
						<div>
							<dt>provider owned by</dt>
							<dd>
								{providerOwnedBy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiModelTimestamp}
			>
				{#snippet children(entity)}
					{@const availabilityStatus = entity.availabilityStatus}
					{#if availabilityStatus != null}
						<div>
							<dt>availability status</dt>
							<dd>
								{availabilityStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiModelTimestamp}
			>
				{#snippet children(entity)}
					{@const providerLifecycleStatus = entity.providerLifecycleStatus}
					{#if providerLifecycleStatus != null}
						<div>
							<dt>provider lifecycle status</dt>
							<dd>
								{providerLifecycleStatus}
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
							releaseDate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const releaseDate = entity.releaseDate}
					{#if releaseDate != null}
						<div>
							<dt>release date</dt>
							<dd>
								<Timestamp timestamp={releaseDate} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							deprecationDate: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deprecationDate = entity.deprecationDate}
					{#if deprecationDate != null}
						<div>
							<dt>deprecation date</dt>
							<dd>
								<Timestamp timestamp={deprecationDate} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							deprecated: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deprecated = entity.deprecated}
					{#if deprecated != null}
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
					viewSelection({
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const deleted = entity.deleted}
					{#if deleted != null}
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
					viewSelection({
						fields: {
							contextWindowTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contextWindowTokens = entity.contextWindowTokens}
					{#if contextWindowTokens != null}
						<div>
							<dt>context window tokens</dt>
							<dd>
								{contextWindowTokens}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							maxInputTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxInputTokens = entity.maxInputTokens}
					{#if maxInputTokens != null}
						<div>
							<dt>max input tokens</dt>
							<dd>
								{maxInputTokens}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							maxOutputTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxOutputTokens = entity.maxOutputTokens}
					{#if maxOutputTokens != null}
						<div>
							<dt>max output tokens</dt>
							<dd>
								{maxOutputTokens}
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
							supportedToolUse: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supportedToolUse = entity.supportedToolUse}
					{#if supportedToolUse != null}
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
					viewSelection({
						fields: {
							supportedStructuredOutput: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supportedStructuredOutput = entity.supportedStructuredOutput}
					{#if supportedStructuredOutput != null}
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
					viewSelection({
						fields: {
							supportedJsonMode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supportedJsonMode = entity.supportedJsonMode}
					{#if supportedJsonMode != null}
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
					viewSelection({
						fields: {
							supportedStreaming: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supportedStreaming = entity.supportedStreaming}
					{#if supportedStreaming != null}
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
					viewSelection({
						fields: {
							supportedThinking: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supportedThinking = entity.supportedThinking}
					{#if supportedThinking != null}
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
					viewSelection({
						fields: {
							tokenizerUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenizerUrl = entity.tokenizerUrl}
					{#if tokenizerUrl != null}
						<div>
							<dt>tokenizer URL</dt>
							<dd>
								<a
									href={tokenizerUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={tokenizerUrl} />
								</a>
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
							inputPricePerMillionTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const inputPricePerMillionTokens = entity.inputPricePerMillionTokens}
					{#if inputPricePerMillionTokens != null}
						<div>
							<dt>input price per million tokens</dt>
							<dd>
								{inputPricePerMillionTokens}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							outputPricePerMillionTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const outputPricePerMillionTokens = entity.outputPricePerMillionTokens}
					{#if outputPricePerMillionTokens != null}
						<div>
							<dt>output price per million tokens</dt>
							<dd>
								{outputPricePerMillionTokens}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cacheReadPricePerMillionTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cacheReadPricePerMillionTokens = entity.cacheReadPricePerMillionTokens}
					{#if cacheReadPricePerMillionTokens != null}
						<div>
							<dt>cache read price per million tokens</dt>
							<dd>
								{cacheReadPricePerMillionTokens}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cacheWritePricePerMillionTokens: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cacheWritePricePerMillionTokens = entity.cacheWritePricePerMillionTokens}
					{#if cacheWritePricePerMillionTokens != null}
						<div>
							<dt>cache write price per million tokens</dt>
							<dd>
								{cacheWritePricePerMillionTokens}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							rateLimitTier: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rateLimitTier = entity.rateLimitTier}
					{#if rateLimitTier != null}
						<div>
							<dt>rate limit tier</dt>
							<dd>
								{rateLimitTier}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
