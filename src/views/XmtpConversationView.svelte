<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		children,
		entityId,
		title: titleProp,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.XmtpConversation>
			title?: string
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
		>
	> = $props()


	const conversationIdKey = $derived(
		stringify(entityId),
	)

	const conversationQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.XmtpConversation] })
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

	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.XmtpConversation}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={titleProp ?? 'Conversation'}
>
	{#snippet Content()}
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
				entityType={EntityType.XmtpConversation}
				{entityId}
			>
				<QueryBoundary
					query={conversationQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No conversation data for this id yet.
						</p>
					{:else}
						<dl>
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

						<p data-text="muted">
							Only basic conversation info is available here for now.
						</p>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
