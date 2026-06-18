<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
import { ListOrientation } from '$/components/ListOrientation.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	// State
	let {
		selection,
		id,
		limit = 25,
		open = $bindable(true),
		collapsible = true,
		CollapsibleProps = {},
		href,
		title = 'Submissions'
	}: {
		selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
			id: string
		limit?: number
		open?: boolean
		collapsible?: boolean
		href?: ComponentProps<typeof EntitiesList>['href']
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
	} = $props()



	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<EntitiesList
	{CollapsibleProps}
	entityType={EntityType.RedditLink}
	{id}
	{title}
	bind:open
	{collapsible}
	{href}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Submissions and comment threads sourced from Reddit’s own HTTP APIs.
		</p>
		<p>
			Not Farcaster casts, team rooms, or file pinning networks.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No Reddit submissions here yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [
						Source.Reddit_Rest,
						Source.Reddit_PublicJson,
					],
					limit,
				})} placeholderText="Loading submissions…">
				{#snippet children(links)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.RedditLink}
						id={`${id}-items`}
						{title}
						open={true}
						items={links.entities}
						getKey={(link) => link.entitySelector.fullname}
						getSortValue={(link) => link.entitySelector.fullname}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
							No Reddit submissions here yet.
						</p>
						{/snippet}

						{#snippet Item({ item })}
							<RedditLinkView
							selector={item.entitySelector}
							layout={EntityLayout.Summary}

						/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
