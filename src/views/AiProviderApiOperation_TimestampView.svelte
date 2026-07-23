<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.AiProviderApiOperation_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AiProviderApiOperation_Timestamp>
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
	const aiProviderApiOperationTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			availabilityStatus: true,
			error: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			availabilityStatus: true,
			error: true,
		},
	}))
	const titleFallback = 'AI provider API operation timestamp'
	const viewDomId = $derived('ai-provider-api-operation-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AiProviderApiOperationView from '$/views/AiProviderApiOperationView.svelte'
</script>


<EntityView
	entityType={EntityType.AiProviderApiOperation_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$operation') && prefetched.$operation != null && Object.hasOwn(prefetched.$operation, 'label') && Object.hasOwn(prefetched.$operation, 'operationKind') && Object.hasOwn(prefetched.$operation, 'pathTemplate') && Object.hasOwn(prefetched, 'availabilityStatus') && Object.hasOwn(prefetched, 'error')}
			{@const aiProviderApiOperation0 = pendingEntity.$operation}
			{#if aiProviderApiOperation0 != null && selection.entitySelector.$operation != null}
				<AiProviderApiOperationView
					selection={select(EntityType.AiProviderApiOperation, selection.entitySelector.$operation, { sources: selection.sources })}
					prefetched={aiProviderApiOperation0}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={aiProviderApiOperationTimestamp}>
				{#snippet children(entity)}
					<AiProviderApiOperationView
						selection={select(EntityType.AiProviderApiOperation, selection.entitySelector.$operation)}
						href=""
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$operation') && prefetched.$operation != null && Object.hasOwn(prefetched.$operation, 'label') && Object.hasOwn(prefetched.$operation, 'operationKind') && Object.hasOwn(prefetched.$operation, 'pathTemplate') && Object.hasOwn(prefetched, 'availabilityStatus') && Object.hasOwn(prefetched, 'error')}
			{[String((pendingEntity.availabilityStatus) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={aiProviderApiOperationTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.availabilityStatus) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$operation') && prefetched.$operation != null && Object.hasOwn(prefetched.$operation, 'label') && Object.hasOwn(prefetched.$operation, 'operationKind') && Object.hasOwn(prefetched.$operation, 'pathTemplate') && Object.hasOwn(prefetched, 'availabilityStatus') && Object.hasOwn(prefetched, 'error')}
			{@const error0 = pendingEntity.error}
			{#if error0 !== undefined && error0 !== null}
				<span data-text="muted">
					{String((error0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiProviderApiOperationTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error0 = resolvedEntity.error}
					{#if error0 !== undefined && error0 !== null}
						<span data-text="muted">
							{String((error0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>operation</dt>
				<dd>
					<AiProviderApiOperationView
						selection={select(EntityType.AiProviderApiOperation, selection.entitySelector.$operation)}
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
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
