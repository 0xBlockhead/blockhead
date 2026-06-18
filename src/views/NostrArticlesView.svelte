<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		selection,
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
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
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
				<ResourceBoundary resource={selection({
					sources: selection.entityType === EntityType.NostrNetwork ?
						[Source.Constants_Internal, Source.NostrBand_Rest, Source.Primal_Rest]
					:
						[Source.NostrBand_Rest, Source.Primal_Rest],
					limit,
				})} placeholderText={`Loading ${title.toLowerCase()}…`}>
					{#snippet children(articles)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.NostrArticle}
						id={`${id}-items`}
						{title}
							items={articles.entities}
						getKey={(row) => stringify(row.entitySelector)}
						getSortValue={(row) => stringify(row.entitySelector)}
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
