<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityFieldReference,
		id,
		limit = 25,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		fieldOpen = true,
		title = 'Articles',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NostrArticle>
			id: string
			limit?: number
			open?: boolean
			fieldOpen?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NostrArticle}
	{id}
	bind:open
	placeholderText={`Loading ${title.toLowerCase()}…`}
	{title}
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			NIP-23 long-form articles are kind-30023 parameterized replaceable events.
		</p>
		<p>
			Article ids pair the author pubkey (64 lowercase hex) with a stable <code>d</code>-tag identifier—not a note event hash alone.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				(
					entityFieldReference.entityType === EntityType.NostrNetwork ?
						(
							fieldOpen ?
								{
									$: [Source.Constants_Internal],
									$$nostrArticles: {
										$: [Source.NostrBand_Rest],
									},
									$$nostrProfiles: {
										$: [
											Source.Constants_Internal,
											Source.NostrBand_Rest,
											Source.Primal_Rest,
										],
										$$articles: {
											$: [
												Source.NostrBand_Rest,
												Source.Primal_Rest,
											],
										},
									},
								}
							:
								{
									$: [Source.Constants_Internal],
								}
						)
					:
						{
							$: [
								Source.NostrBand_Rest,
								Source.Primal_Rest,
							],
							[entityFieldReference.fieldName]: {
								$: [
									Source.NostrBand_Rest,
									Source.Primal_Rest,
								],
							},
						}
				),
			)}
			{@const articles = derive(
				parent,
				(parent) => {
					const nostrArticles: Entity<typeof schema, EntityType.NostrArticle>[] = (
						entityFieldReference.entityType === EntityType.NostrNetwork ?
							[
								...(parent.$$nostrArticles ?? []),
								...(parent.$$nostrProfiles ?? [])
									.flatMap((profile) => profile.$$articles ?? []),
							]
						:
							(parent[entityFieldReference.fieldName] ?? [])
					)
					return nostrArticles.slice(0, limit)
				},
			)}
			{#key `${stringify(entityFieldReference.entityId)}-${limit}-${fieldOpen}`}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.NostrArticle}
					id={`${id}-items`}
					{title}
					getKey={(row) => stringify(nostrArticle[EntityMetaKey.Id])}
					getSortValue={(row) => (
						`${String(-(nostrArticle.publishedAt ?? 0)).padStart(20, '0')}\0${nostrArticle[EntityMetaKey.Id].identifier}`
					)}
					placeholderText={`Loading ${title.toLowerCase()}…`}
					resource={articles}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No articles yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<NostrArticleView
							entityId={item[EntityMetaKey.Id]}
							layout={EntityLayout.SummaryDetails}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			{/key}
		{/if}
	{/snippet}
</EntitiesList>
