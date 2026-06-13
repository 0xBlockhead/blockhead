<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	type AtprotoPostOrderFieldRow = {
		createdAt?: number
		[EntityMetaKey.IdKey]: string
	}


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		entityFieldReference,
		id,
		href = '',
		limit = 50,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Thread',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.AtprotoPost>
			id: string
			href?: string
			limit?: number
			open?: boolean
			collapsible?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()

	import type { DeclarativeOrderBy } from '$/client/$client.svelte.ts'

	const atprotoPostOrderBy = [
		[
			({ fieldRow }) => fieldRow.createdAt,
			'asc',
		],
		[
			({ fieldRow }) => fieldRow[EntityMetaKey.IdKey],
			'asc',
		],
	] as const satisfies DeclarativeOrderBy<AtprotoPostOrderFieldRow>


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


<EntitiesList
	entityType={EntityType.AtprotoPost}
	{id}
	href={href}
	bind:open
	{collapsible}
	{title}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			<code>$$thread</code> lists ancestor and reply posts around this at-URI from Atproto_Xrpc / Atproto_BskySocial_Xrpc <code>getPostThread</code> responses.
		</p>
		<p>
			Ordering follows record <code>createdAt</code> when available; empty lists mean no parent or replies were returned within the fetched depth window.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					sources: [
						Source.Atproto_Xrpc,
						Source.Atproto_BskySocial_Xrpc,
					],
					fields: (
						open ?
							{
								[entityFieldReference.fieldName]: {
									sources: [
										Source.Atproto_Xrpc,
										Source.Atproto_BskySocial_Xrpc,
									],
									orderBy: [...atprotoPostOrderBy],
									limit: limit,
								},
							}
						:
							{}
					),
				},
			)}
			<ResourceBoundary
				resource={parent}
				placeholderText={`Loading ${title.toLowerCase()}…`}
			>
				{#snippet children(parent)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.AtprotoPost}
						id={`${id}-items`}
						href={href}
						getKey={(atprotoPost) => atprotoPost[EntityMetaKey.Id].uri}
						placeholderText={`Loading ${title.toLowerCase()}…`}
						items={parent.fields[entityFieldReference.fieldName]?.values ?? []}
						{title}
						open={true}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No thread posts yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<AtprotoPostView
								entityId={{ uri: item[EntityMetaKey.Id].uri }}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
