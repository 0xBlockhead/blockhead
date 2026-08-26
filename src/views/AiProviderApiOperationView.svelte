<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		href,
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
	href={
		href === undefined ?
			(
				'providerId' in selection.entitySelector.$provider ?
					resolve(
						'/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/operation/[operationId=stringSegment]',
						{
							providerId: selection.entitySelector.$provider.providerId,
							operationId: selection.entitySelector.operationId,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
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

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>provider</dt>
				<dd>
					<AiModelProviderView
						selection={select(EntityType.AiModelProvider, selection.entitySelector.$provider)}
						layout={EntityLayout.Value}
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

	{#snippet Details()}
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
