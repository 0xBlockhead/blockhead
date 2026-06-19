<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


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
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.NostrArticle>
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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
						[Source.Constants_Internal]
					: selection.entityType === EntityType.NostrProfile ?
						[Source.Constants_Internal]
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
						getKey={(row) => stringify(row[EntityMetaKey.Selector])}
						getSortValue={(row) => stringify(row[EntityMetaKey.Selector])}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
						placeholderText={`Loading ${title.toLowerCase()}…`}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No articles yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<a
								href={resolve('/(social)/(nostr)/nostr/article/[pubkey]/[identifier]', {
									pubkey: item[EntityMetaKey.Selector].pubkey,
									identifier: item[EntityMetaKey.Selector].identifier,
								})}
							>
								<TruncatedValue
									value={item[EntityMetaKey.Selector].identifier}
									format={TruncatedValueFormat.Visual}
								/>
							</a>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
