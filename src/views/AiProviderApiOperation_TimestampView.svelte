<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.AiProviderApiOperation_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Anthropic_Rest,
			Source.OpenAI_Rest,
		],
	}))
	const aiProviderApiOperationTimestamp = $derived(viewSelection({
		fields: {
			availabilityStatus: true,
			error: true,
		},
	}))
	const titleFallback = 'AI provider API operation timestamp'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AiProviderApiOperationView from '$/views/AiProviderApiOperationView.svelte'
</script>


<EntityView
	entityType={EntityType.AiProviderApiOperation_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<AiProviderApiOperationView
			selection={select(EntityType.AiProviderApiOperation, selection.entitySelector.$operation)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiProviderApiOperationTimestamp}>
			{#snippet children(entity)}
				{(entity.availabilityStatus ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiProviderApiOperationTimestamp}>
			{#snippet children(entity)}
				{@const error = entity.error}
				{#if error != null}
					<span data-text="muted">
						{error}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>operation</dt>
				<dd>
					<AiProviderApiOperationView
						selection={select(EntityType.AiProviderApiOperation, selection.entitySelector.$operation)}
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
				resource={aiProviderApiOperationTimestamp}
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
				resource={aiProviderApiOperationTimestamp}
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
