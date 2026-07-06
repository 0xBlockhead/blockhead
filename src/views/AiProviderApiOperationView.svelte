<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.AiProviderApiOperation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AiProviderApiOperation>>
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
	const aiProviderApiOperation = $derived(selection({
		sources: [
			Source.Anthropic_Rest,
			Source.OpenAI_Rest,
		],
		fields: {
			label: true,
			operationKind: true,
			pathTemplate: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.label) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.operationId ?? prefetched.operationId) ?? '')].filter(Boolean).join(' ') || 'AI provider API operation')
	const viewDomId = $derived('ai-provider-api-operation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiProviderApiOperation_TimestampsView from '$/views/AiProviderApiOperation_TimestampsView.svelte'
	import AiModelProviderView from '$/views/AiModelProviderView.svelte'
</script>


<EntityView
	entityType={EntityType.AiProviderApiOperation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aiProviderApiOperation}>
			{#snippet Pending()}
				{[String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.operationId ?? prefetched.operationId) ?? '')].filter(Boolean).join(' ') || 'AI provider API operation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiProviderApiOperation}>
			{#snippet Pending()}
				{[String((prefetched.operationKind) ?? '')].filter(Boolean).join(' ') || [String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.operationId ?? prefetched.operationId) ?? '')].filter(Boolean).join(' ') || 'AI provider API operation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.operationKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiProviderApiOperation}>
			{#snippet Pending()}
				{@const pathTemplate0 = prefetched.pathTemplate}
				{#if pathTemplate0 !== undefined && pathTemplate0 !== null}
					<span data-text="muted">
						{String((pathTemplate0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const pathTemplate0 = resolvedEntity.pathTemplate}
				{#if pathTemplate0 !== undefined && pathTemplate0 !== null}
					<span data-text="muted">
						{String((pathTemplate0) ?? '')}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									operationId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const operationId = selection.entitySelector.operationId ?? prefetched.operationId}
							{#if operationId !== undefined && operationId !== null}
								{String((operationId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const operationId = resolvedEntity.operationId}
							{#if operationId !== undefined && operationId !== null}
								{String((operationId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const label = prefetched.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const label = resolvedEntity.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							operationKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const operationKind = prefetched.operationKind}
					{#if operationKind !== undefined && operationKind !== null}
						<div>
							<dt>operation kind</dt>
							<dd>
								{String((operationKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const operationKind = resolvedEntity.operationKind}
					{#if operationKind !== undefined && operationKind !== null}
						<div>
							<dt>operation kind</dt>
							<dd>
								{String((operationKind) ?? '')}
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
							httpMethod: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const httpMethod = prefetched.httpMethod}
					{#if httpMethod !== undefined && httpMethod !== null}
						<div>
							<dt>HTTP method</dt>
							<dd>
								{String((httpMethod) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const httpMethod = resolvedEntity.httpMethod}
					{#if httpMethod !== undefined && httpMethod !== null}
						<div>
							<dt>HTTP method</dt>
							<dd>
								{String((httpMethod) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pathTemplate: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pathTemplate = prefetched.pathTemplate}
					{#if pathTemplate !== undefined && pathTemplate !== null}
						<div>
							<dt>path template</dt>
							<dd>
								{String((pathTemplate) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pathTemplate = resolvedEntity.pathTemplate}
					{#if pathTemplate !== undefined && pathTemplate !== null}
						<div>
							<dt>path template</dt>
							<dd>
								{String((pathTemplate) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							documentUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const documentUrl = prefetched.documentUrl}
					{#if documentUrl !== undefined && documentUrl !== null}
						<div>
							<dt>document URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(documentUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(documentUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const documentUrl = resolvedEntity.documentUrl}
					{#if documentUrl !== undefined && documentUrl !== null}
						<div>
							<dt>document URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(documentUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(documentUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AiProviderApiOperation_TimestampsView
				selection={selection[EntityProxyField]<EntityType.AiProviderApiOperation_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No AI provider API operation observations.'
				id='AiProviderApiOperation_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
