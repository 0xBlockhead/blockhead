<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAgentConversation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadAgentConversation>>
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

	const blockheadAgentConversation = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			name: true,
			pinned: true,
			createdAt: true,
			updatedAt: true,
			...(open && {
				systemPrompt: true,
				defaultConnectionId: true,
				defaultModelId: true,
				$$turns: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'agent conversation')
	const viewDomId = $derived('blockhead-agent-conversation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadAgentConversationTurnsView from '$/views/BlockheadAgentConversationTurnsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConversation}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'agent conversation'}
		{:else}
			<ResourceBoundary resource={blockheadAgentConversation}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'agent conversation'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const updatedAt0 = ({ ...selection.entitySelector, ...prefetched }).updatedAt}
			{#if updatedAt0 !== undefined && updatedAt0 !== null}
				<Timestamp timestamp={Number(updatedAt0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadAgentConversation}>
				{#snippet Pending()}
					{@const updatedAt0 = ({ ...selection.entitySelector, ...prefetched }).updatedAt}
					{#if updatedAt0 !== undefined && updatedAt0 !== null}
						<Timestamp timestamp={Number(updatedAt0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const updatedAt0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).updatedAt}
					{#if updatedAt0 !== undefined && updatedAt0 !== null}
						<Timestamp timestamp={Number(updatedAt0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Pinned</dt>
				<dd>
					<ResourceBoundary resource={blockheadAgentConversation}>
						{#snippet Pending()}
							{@const pinned = prefetched.pinned ?? selection.entitySelector.pinned}
							{#if pinned !== undefined && pinned !== null}
								{String((pinned) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const pinned = entity.pinned ?? selection.entitySelector.pinned ?? prefetched.pinned}
							{#if pinned !== undefined && pinned !== null}
								{String((pinned) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary resource={blockheadAgentConversation}>
						{#snippet Pending()}
							{@const createdAt = prefetched.createdAt ?? selection.entitySelector.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const createdAt = entity.createdAt ?? selection.entitySelector.createdAt ?? prefetched.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={blockheadAgentConversation}>
				{#snippet Pending()}
					{@const defaultConnectionId = prefetched.defaultConnectionId ?? selection.entitySelector.defaultConnectionId}
					{#if defaultConnectionId !== undefined && defaultConnectionId !== null}
						<div>
							<dt>Default connection ID</dt>
							<dd>
								{String((defaultConnectionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const defaultConnectionId = entity.defaultConnectionId ?? selection.entitySelector.defaultConnectionId ?? prefetched.defaultConnectionId}
					{#if defaultConnectionId !== undefined && defaultConnectionId !== null}
						<div>
							<dt>Default connection ID</dt>
							<dd>
								{String((defaultConnectionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={blockheadAgentConversation}>
				{#snippet Pending()}
					{@const defaultModelId = prefetched.defaultModelId ?? selection.entitySelector.defaultModelId}
					{#if defaultModelId !== undefined && defaultModelId !== null}
						<div>
							<dt>Default model ID</dt>
							<dd>
								{String((defaultModelId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const defaultModelId = entity.defaultModelId ?? selection.entitySelector.defaultModelId ?? prefetched.defaultModelId}
					{#if defaultModelId !== undefined && defaultModelId !== null}
						<div>
							<dt>Default model ID</dt>
							<dd>
								{String((defaultModelId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary resource={blockheadAgentConversation}>
			{#snippet children(entity)}
				{@const systemPrompt = entity.systemPrompt ?? selection.entitySelector.systemPrompt ?? prefetched.systemPrompt}
				{#if systemPrompt === undefined || systemPrompt === null || systemPrompt === ''}
					<p data-text="muted">No system prompt available.</p>
				{:else}
					<p data-text="long-text">{String((systemPrompt) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadAgentConversationTurnsView
				selection={selection[EntityProxyField]<EntityType.BlockheadAgentConversationTurn>('$$turns')}
				title='Turns'
				emptyText='No turns yet.'
				id='BlockheadAgentConversationTurnsView-$$turns'
			/>
		{/if}
	{/snippet}
</EntityView>
