<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


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
			collapsible?: boolean
			fieldOpen?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
			{@const parent = proxy(entityFieldReference.entityType,
				entityFieldReference.selector,
				(
					entityFieldReference.entityType === EntityType.NostrNetwork ?
						(
							fieldOpen ?
								{
									sources: [Source.Constants_Internal],
									fields: {
										$$nostrArticles: {
											sources: [Source.NostrBand_Rest],
											limit: limit,
										},
										$$nostrProfiles: {
											sources: [
												Source.Constants_Internal,
												Source.NostrBand_Rest,
												Source.Primal_Rest,
											],
											fields: {
												$$articles: {
													sources: [
														Source.NostrBand_Rest,
														Source.Primal_Rest,
													],
													limit: limit,
												},
											},
										},
									},
								}
							:
								{
									sources: [Source.Constants_Internal],
								}
						)
					:
						{
							sources: [
								Source.NostrBand_Rest,
								Source.Primal_Rest,
							],
							fields: {
								$$articles: {
									sources: [
										Source.NostrBand_Rest,
										Source.Primal_Rest,
									],
									limit: limit,
								},
							},
						}
				),
			)}
			<ResourceBoundary resource={parent} placeholderText={`Loading ${title.toLowerCase()}…`}>
				{#snippet children(parent)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.NostrArticle}
						id={`${id}-items`}
						{title}
						items={entityFieldReference.entityType === EntityType.NostrNetwork ?
							[
								...(parent?.['$$nostrArticles'].entities ?? []),
								...(parent?.['$$nostrProfiles'].entities ?? [])
									.flatMap((profile) => profile.current?.['$$articles'].entities ?? []),
							]
						:
							parent.fields[entityFieldReference.fieldName]?.entities ?? []}
						getKey={(row) => stringify(row.entitySelector)}
						getSortValue={(row) => (
							`${String(-(row.current?.publishedAt ?? 0)).padStart(20, '0')}\0${row.entitySelector.identifier}`
						)}
						placeholderText={`Loading ${title.toLowerCase()}…`}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No articles yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<NostrArticleView
								selector={item.entitySelector}
								layout={EntityLayout.SummaryDetails}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
