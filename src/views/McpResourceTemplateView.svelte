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
			selection: EntityProxyResource<typeof schema, EntityType.McpResourceTemplate>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.McpResourceTemplate>>
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
	const mcpResourceTemplate = $derived(selection({
		sources: [
			Source.McpDeclared_Protocol,
		],
		fields: {
			title: true,
			mimeType: true,
			name: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.title) ?? '')].filter(Boolean).join(' ') || [String((prefetched.name) ?? ''), String((selection.entitySelector.uriTemplate ?? prefetched.uriTemplate) ?? '')].filter(Boolean).join(' ') || 'mcp resource template')
	const viewDomId = $derived('mcp-resource-template-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import McpServerView from '$/views/McpServerView.svelte'
</script>


<EntityView
	entityType={EntityType.McpResourceTemplate}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={mcpResourceTemplate}>
			{#snippet Pending()}
				{[String((prefetched.title) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.name) ?? ''), String((selection.entitySelector.uriTemplate ?? prefetched.uriTemplate) ?? '')].filter(Boolean).join(' ') || 'mcp resource template'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={mcpResourceTemplate}>
			{#snippet Pending()}
				{[String((prefetched.mimeType) ?? '')].filter(Boolean).join(' ') || [String((prefetched.title) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.name) ?? ''), String((selection.entitySelector.uriTemplate ?? prefetched.uriTemplate) ?? '')].filter(Boolean).join(' ') || 'mcp resource template'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.mimeType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.title) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>server</dt>
				<dd>
					<McpServerView
						selection={select(EntityType.McpServer, selection.entitySelector.$server)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>URI template</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									uriTemplate: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const uriTemplate = selection.entitySelector.uriTemplate ?? prefetched.uriTemplate}
							{#if uriTemplate !== undefined && uriTemplate !== null}
								<svelte:element
									this={'a'}
									href={String(uriTemplate)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(uriTemplate)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const uriTemplate = resolvedEntity.uriTemplate}
							{#if uriTemplate !== undefined && uriTemplate !== null}
								<svelte:element
									this={'a'}
									href={String(uriTemplate)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(uriTemplate)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = prefetched.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							title: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const title = prefetched.title}
					{#if title !== undefined && title !== null}
						<div>
							<dt>title</dt>
							<dd>
								{String((title) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const title = resolvedEntity.title}
					{#if title !== undefined && title !== null}
						<div>
							<dt>title</dt>
							<dd>
								{String((title) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const description = prefetched.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const description = resolvedEntity.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mimeType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mimeType = prefetched.mimeType}
					{#if mimeType !== undefined && mimeType !== null}
						<div>
							<dt>mime type</dt>
							<dd>
								{String((mimeType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mimeType = resolvedEntity.mimeType}
					{#if mimeType !== undefined && mimeType !== null}
						<div>
							<dt>mime type</dt>
							<dd>
								{String((mimeType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
