<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AiProviderApiOperation> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Anthropic_Rest,
			Source.OpenAI_Rest,
		],
	}))
	const aiProviderApiOperation = $derived(viewSelection({
		fields: {
			label: true,
			operationKind: true,
			pathTemplate: true,
		},
	}))
	const titleFallback = $derived((prefetched.label ?? '') || selection.entitySelector.operationId || 'AI provider API operation')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiProviderApiOperation_TimestampsView from '$/views/AiProviderApiOperation_TimestampsView.svelte'
	import AiModelProviderView from '$/views/AiModelProviderView.svelte'
</script>


<EntityView
	entityType={EntityType.AiProviderApiOperation}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aiProviderApiOperation}>
			{#snippet children(entity)}
				{(entity.label ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiProviderApiOperation}>
			{#snippet children(entity)}
				{(entity.operationKind ?? '') || (entity.label ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiProviderApiOperation}>
			{#snippet children(entity)}
				{@const pathTemplate = entity.pathTemplate}
				{#if pathTemplate != null}
					<span data-text="muted">
						{pathTemplate}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>provider</dt>
				<dd>
					<AiModelProviderView
						selection={select(EntityType.AiModelProvider, selection.entitySelector.$provider)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>operation ID</dt>
				<dd>
					{selection.entitySelector.operationId}
				</dd>
			</div>

			<ResourceBoundary
				resource={aiProviderApiOperation}
			>
				{#snippet children(entity)}
					{@const label = entity.label}
					{#if label != null}
						<div>
							<dt>Label</dt>
							<dd>
								{label}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiProviderApiOperation}
			>
				{#snippet children(entity)}
					{@const operationKind = entity.operationKind}
					{#if operationKind != null}
						<div>
							<dt>operation kind</dt>
							<dd>
								{operationKind}
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
							httpMethod: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const httpMethod = entity.httpMethod}
					{#if httpMethod != null}
						<div>
							<dt>HTTP method</dt>
							<dd>
								{httpMethod}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiProviderApiOperation}
			>
				{#snippet children(entity)}
					{@const pathTemplate = entity.pathTemplate}
					{#if pathTemplate != null}
						<div>
							<dt>path template</dt>
							<dd>
								{pathTemplate}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							documentUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const documentUrl = entity.documentUrl}
					{#if documentUrl != null}
						<div>
							<dt>document URL</dt>
							<dd>
								<a
									href={documentUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={documentUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AiProviderApiOperation_TimestampsView
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
