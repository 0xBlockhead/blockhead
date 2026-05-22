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


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		href,
		id,
		limit = 25,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Articles',
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NostrArticle>
			href: string
			id: string
			limit?: number
			open?: boolean
			title?: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NostrArticle}
	{href}
	{id}
	bind:open
	placeholderText={`Loading ${title.toLowerCase()}…`}
	{title}
	{collapsible}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			NIP-23 long-form articles are kind-30023 parameterized replaceable events.
		</p>
		<p>
			Article ids pair the author pubkey (64 lowercase hex) with a stable <code>d</code>-tag identifier—not a note event hash alone.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const fieldName = entityFieldReference.fieldName}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				(
					entityFieldReference.entityType === EntityType.NostrNetwork ?
						{
							$: [Source.Constants_Internal],
							[fieldName]: {
								$: [
									Source.NostrBand_Rest,
									Source.Primal_Rest,
								],
							},
						}
					:
						{
							$: [
								Source.NostrBand_Rest,
								Source.Primal_Rest,
							],
							[fieldName]: {
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
					const rows: Entity<typeof schema, EntityType.NostrArticle>[] = (
						parent[fieldName] ?? []
					)
					return rows.slice(0, limit)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.NostrArticle}
				id={`${id}-items`}
				{href}
				{title}
				getKey={(row) => stringify(row[EntityMetaKey.Id])}
				getSortValue={(row) => (
					`${String(-(row.publishedAt ?? 0)).padStart(20, '0')}\0${row[EntityMetaKey.Id].identifier}`
				)}
				placeholderKeys={new SvelteSet()}
				placeholderText={`Loading ${title.toLowerCase()}…`}
				resource={articles}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No articles yet.
					</p>
				{/snippet}

				{#snippet Item(props)}
					{#if props.item}
						<NostrArticleView
							entityId={props.item[EntityMetaKey.Id]}
							href={resolve('/nostr/article/[pubkey]/[identifier]', {
								pubkey: props.item[EntityMetaKey.Id].pubkey,
								identifier: encodeURIComponent(props.item[EntityMetaKey.Id].identifier),
							})}
							layout={EntityLayout.SummaryDetails}
							open={false}
						/>
					{/if}
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
