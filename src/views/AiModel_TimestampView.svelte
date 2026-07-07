<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { UrlString } from '$/schema/UrlString.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AiModel_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AiModel_Timestamp>>
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
		sources: [
			Source.Anthropic_Rest,
			Source.OpenAI_Rest,
		],
		fields: {
			providerDisplayName: true,
			availabilityStatus: true,
			providerLifecycleStatus: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.providerDisplayName) ?? '')].filter(Boolean).join(' ') || 'AI model timestamp')
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
		<ResourceBoundary resource={aiModelTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.providerDisplayName) ?? '')].filter(Boolean).join(' ') || title || 'AI model timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.providerDisplayName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiModelTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.availabilityStatus) ?? '')].filter(Boolean).join(' ') || [String((prefetched.providerDisplayName) ?? '')].filter(Boolean).join(' ') || title || 'AI model timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.availabilityStatus) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.providerDisplayName) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiModelTimestamp}>
			{#snippet Pending()}
				{@const providerLifecycleStatus0 = prefetched.providerLifecycleStatus}
				{#if providerLifecycleStatus0 !== undefined && providerLifecycleStatus0 !== null}
					<span data-text="muted">
						{String((providerLifecycleStatus0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							providerObjectType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerObjectType = prefetched.providerObjectType}
					{#if providerObjectType !== undefined && providerObjectType !== null}
						<div>
							<dt>provider object type</dt>
							<dd>
								{String((providerObjectType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							providerDisplayName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerDisplayName = prefetched.providerDisplayName}
					{#if providerDisplayName !== undefined && providerDisplayName !== null}
						<div>
							<dt>provider display name</dt>
							<dd>
								{String((providerDisplayName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							providerDescription: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerDescription = prefetched.providerDescription}
					{#if providerDescription !== undefined && providerDescription !== null}
						<div>
							<dt>provider description</dt>
							<dd>
								{String((providerDescription) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							providerVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerVersion = prefetched.providerVersion}
					{#if providerVersion !== undefined && providerVersion !== null}
						<div>
							<dt>provider version</dt>
							<dd>
								{String((providerVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							providerOwnedBy: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerOwnedBy = prefetched.providerOwnedBy}
					{#if providerOwnedBy !== undefined && providerOwnedBy !== null}
						<div>
							<dt>provider owned by</dt>
							<dd>
								{String((providerOwnedBy) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							availabilityStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const availabilityStatus = prefetched.availabilityStatus}
					{#if availabilityStatus !== undefined && availabilityStatus !== null}
						<div>
							<dt>availability status</dt>
							<dd>
								{String((availabilityStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							providerLifecycleStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerLifecycleStatus = prefetched.providerLifecycleStatus}
					{#if providerLifecycleStatus !== undefined && providerLifecycleStatus !== null}
						<div>
							<dt>provider lifecycle status</dt>
							<dd>
								{String((providerLifecycleStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							releaseDate: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const releaseDate = prefetched.releaseDate}
					{#if releaseDate !== undefined && releaseDate !== null}
						<div>
							<dt>release date</dt>
							<dd>
								<Timestamp timestamp={Number(releaseDate)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							deprecationDate: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deprecationDate = prefetched.deprecationDate}
					{#if deprecationDate !== undefined && deprecationDate !== null}
						<div>
							<dt>deprecation date</dt>
							<dd>
								<Timestamp timestamp={Number(deprecationDate)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							deprecated: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deprecated = prefetched.deprecated}
					{#if deprecated !== undefined && deprecated !== null}
						<div>
							<dt>deprecated</dt>
							<dd>
								{deprecated ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deleted = prefetched.deleted}
					{#if deleted !== undefined && deleted !== null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							contextWindowTokens: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contextWindowTokens = prefetched.contextWindowTokens}
					{#if contextWindowTokens !== undefined && contextWindowTokens !== null}
						<div>
							<dt>context window tokens</dt>
							<dd>
								{String((contextWindowTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							maxInputTokens: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxInputTokens = prefetched.maxInputTokens}
					{#if maxInputTokens !== undefined && maxInputTokens !== null}
						<div>
							<dt>max input tokens</dt>
							<dd>
								{String((maxInputTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							maxOutputTokens: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxOutputTokens = prefetched.maxOutputTokens}
					{#if maxOutputTokens !== undefined && maxOutputTokens !== null}
						<div>
							<dt>max output tokens</dt>
							<dd>
								{String((maxOutputTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							supportedToolUse: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const supportedToolUse = prefetched.supportedToolUse}
					{#if supportedToolUse !== undefined && supportedToolUse !== null}
						<div>
							<dt>supported tool use</dt>
							<dd>
								{supportedToolUse ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							supportedStructuredOutput: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const supportedStructuredOutput = prefetched.supportedStructuredOutput}
					{#if supportedStructuredOutput !== undefined && supportedStructuredOutput !== null}
						<div>
							<dt>supported structured output</dt>
							<dd>
								{supportedStructuredOutput ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							supportedJsonMode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const supportedJsonMode = prefetched.supportedJsonMode}
					{#if supportedJsonMode !== undefined && supportedJsonMode !== null}
						<div>
							<dt>supported JSON mode</dt>
							<dd>
								{supportedJsonMode ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							supportedStreaming: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const supportedStreaming = prefetched.supportedStreaming}
					{#if supportedStreaming !== undefined && supportedStreaming !== null}
						<div>
							<dt>supported streaming</dt>
							<dd>
								{supportedStreaming ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							supportedThinking: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const supportedThinking = prefetched.supportedThinking}
					{#if supportedThinking !== undefined && supportedThinking !== null}
						<div>
							<dt>supported thinking</dt>
							<dd>
								{supportedThinking ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							tokenizerUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenizerUrl = prefetched.tokenizerUrl}
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
						fields: {
							inputPricePerMillionTokens: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const inputPricePerMillionTokens = prefetched.inputPricePerMillionTokens}
					{#if inputPricePerMillionTokens !== undefined && inputPricePerMillionTokens !== null}
						<div>
							<dt>input price per million tokens</dt>
							<dd>
								{String((inputPricePerMillionTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							outputPricePerMillionTokens: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const outputPricePerMillionTokens = prefetched.outputPricePerMillionTokens}
					{#if outputPricePerMillionTokens !== undefined && outputPricePerMillionTokens !== null}
						<div>
							<dt>output price per million tokens</dt>
							<dd>
								{String((outputPricePerMillionTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							cacheReadPricePerMillionTokens: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cacheReadPricePerMillionTokens = prefetched.cacheReadPricePerMillionTokens}
					{#if cacheReadPricePerMillionTokens !== undefined && cacheReadPricePerMillionTokens !== null}
						<div>
							<dt>cache read price per million tokens</dt>
							<dd>
								{String((cacheReadPricePerMillionTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							cacheWritePricePerMillionTokens: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cacheWritePricePerMillionTokens = prefetched.cacheWritePricePerMillionTokens}
					{#if cacheWritePricePerMillionTokens !== undefined && cacheWritePricePerMillionTokens !== null}
						<div>
							<dt>cache write price per million tokens</dt>
							<dd>
								{String((cacheWritePricePerMillionTokens) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							rateLimitTier: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rateLimitTier = prefetched.rateLimitTier}
					{#if rateLimitTier !== undefined && rateLimitTier !== null}
						<div>
							<dt>rate limit tier</dt>
							<dd>
								{String((rateLimitTier) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
