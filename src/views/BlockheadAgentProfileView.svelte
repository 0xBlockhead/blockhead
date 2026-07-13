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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentProfile>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadAgentProfile>>
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
	const blockheadAgentProfile = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			label: true,
			updatedAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.profileId) ?? '')].filter(Boolean).join(' ') || 'blockhead agent profile')
	const viewDomId = $derived('blockhead-agent-profile-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AiModelView from '$/views/AiModelView.svelte'
	import McpServerView from '$/views/McpServerView.svelte'
	import Eip8004AgentRegistrationView from '$/views/Eip8004AgentRegistrationView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentProfile}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadAgentProfile}>
			{#snippet Pending()}
				{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.profileId) ?? '')].filter(Boolean).join(' ') || 'blockhead agent profile'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAgentProfile}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection.$model}
				>
					{#snippet children(aiModel)}
						{#if aiModel != null && aiModel[EntityMetaKey.Selector] != null}
							<AiModelView
								selection={select(EntityType.AiModel, aiModel[EntityMetaKey.Selector])}
								prefetched={aiModel}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection.$model}
				>
					{#snippet children(aiModel)}
						{#if aiModel != null && aiModel[EntityMetaKey.Selector] != null}
							<AiModelView
								selection={select(EntityType.AiModel, aiModel[EntityMetaKey.Selector])}
								prefetched={aiModel}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAgentProfile}>
			{#snippet Pending()}
				{@const updatedAt0 = pendingEntity.updatedAt}
				{#if updatedAt0 !== undefined && updatedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(updatedAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const updatedAt0 = resolvedEntity.updatedAt}
				{#if updatedAt0 !== undefined && updatedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(updatedAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>profile ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									profileId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const profileId = pendingEntity.profileId}
							{#if profileId !== undefined && profileId !== null}
								{String((profileId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const profileId = resolvedEntity.profileId}
							{#if profileId !== undefined && profileId !== null}
								{String((profileId) ?? '')}
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
					{@const label = pendingEntity.label}
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
				resource={selection.$model}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(aiModel)}
					{#if aiModel != null && aiModel[EntityMetaKey.Selector] != null}
						<div>
							<dt>model</dt>
							<dd>
								<AiModelView
									selection={select(EntityType.AiModel, aiModel[EntityMetaKey.Selector])}
									prefetched={aiModel}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$mcpServer}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(mcpServer)}
					{#if mcpServer != null && mcpServer[EntityMetaKey.Selector] != null}
						<div>
							<dt>MCP server</dt>
							<dd>
								<McpServerView
									selection={select(EntityType.McpServer, mcpServer[EntityMetaKey.Selector])}
									prefetched={mcpServer}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$eip8004Registration}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(eip8004AgentRegistration)}
					{#if eip8004AgentRegistration != null && eip8004AgentRegistration[EntityMetaKey.Selector] != null}
						<div>
							<dt>EIP-8004 registration</dt>
							<dd>
								<Eip8004AgentRegistrationView
									selection={select(EntityType.Eip8004AgentRegistration, eip8004AgentRegistration[EntityMetaKey.Selector])}
									prefetched={eip8004AgentRegistration}
									layout={EntityLayout.Value}
									open={false}
								/>
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
							createdAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdAt = pendingEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt = resolvedEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							updatedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const updatedAt = pendingEntity.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAt = resolvedEntity.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
