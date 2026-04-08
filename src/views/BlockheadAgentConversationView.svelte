<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.BlockheadAgentConversation>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Summary'
		>
	> = $props()


	const conversationIdKey = $derived(
		stringify(entityId),
	)

	const conversationQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.BlockheadAgentConversation] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						conversationIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => conversationIdKey],
	)

	const conversationRow = $derived(
		conversationQuery.data?.[0]?.row,
	)

	const conversationField = $derived(
		(() => {
			const bag = conversationRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			const strOrNull = (key: string) => (
				!(
					key in b
				) ?
					undefined
				: b[key] === null ?
					null
				: typeof b[key] === 'string' ?
					(b[key] as string)
				:
					undefined
			)
			const name = (
				!(
					'name' in b
				) ?
					undefined
				: b.name === null || typeof b.name === 'string' ?
					(b.name as string | null)
				:
					undefined
			)
			return {
				name,
				pinned: typeof b.pinned === 'boolean' ? b.pinned : undefined,
				systemPrompt: typeof b.systemPrompt === 'string' ? b.systemPrompt : undefined,
				defaultConnectionId: strOrNull('defaultConnectionId'),
				defaultModelId: strOrNull('defaultModelId'),
				createdAt: (
					typeof b.createdAt === 'number' && Number.isFinite(b.createdAt) ?
						(b.createdAt as number)
					:	undefined
				),
				updatedAt: (
					typeof b.updatedAt === 'number' && Number.isFinite(b.updatedAt) ?
						(b.updatedAt as number)
					:	undefined
				),
			}
		})(),
	)

	const displayTitle = $derived(
		conversationField?.name != null && conversationField.name.length ?
			conversationField.name
		:	entityId.id,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAgentConversation}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Conversation id</dt>
				<dd>
					<TruncatedValue
						value={entityId.id}
						format={TruncatedValueFormat.Visual}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.BlockheadAgentConversation}
				{entityId}
			>
				<QueryBoundary
					query={conversationQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No conversation row in collections yet (no resolver for this conversation).
						</p>
					{:else}
						<dl>
							{#if conversationField?.name !== undefined}
								<div>
									<dt>Name</dt>
									<dd>
										{conversationField.name ?? '—'}
									</dd>
								</div>
							{/if}
							{#if conversationField?.pinned !== undefined}
								<div>
									<dt>Pinned</dt>
									<dd>{String(conversationField.pinned)}</dd>
								</div>
							{/if}
							{#if conversationField?.systemPrompt != null}
								<div>
									<dt>System prompt</dt>
									<dd>
										<TruncatedValue
											value={conversationField.systemPrompt}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}
							{#if conversationField?.defaultConnectionId !== undefined}
								<div>
									<dt>Default connection id</dt>
									<dd>
										{#if conversationField.defaultConnectionId == null}
											—
										{:else}
											<TruncatedValue
												value={conversationField.defaultConnectionId}
												format={TruncatedValueFormat.Visual}
											/>
										{/if}
									</dd>
								</div>
							{/if}
							{#if conversationField?.defaultModelId !== undefined}
								<div>
									<dt>Default model id</dt>
									<dd>
										{#if conversationField.defaultModelId == null}
											—
										{:else}
											<TruncatedValue
												value={conversationField.defaultModelId}
												format={TruncatedValueFormat.Visual}
											/>
										{/if}
									</dd>
								</div>
							{/if}
							{#if conversationField?.createdAt != null}
								<div>
									<dt>Created at</dt>
									<dd>{String(conversationField.createdAt)}</dd>
								</div>
							{/if}
							{#if conversationField?.updatedAt != null}
								<div>
									<dt>Updated at</dt>
									<dd>{String(conversationField.updatedAt)}</dd>
								</div>
							{/if}
						</dl>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
