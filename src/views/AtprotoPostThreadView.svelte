<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	type AtprotoPostOrderFieldRow = {
		createdAt?: number
		[EntityMetaKey.SelectorKey]: string
	}


	// Context
	import { resolve } from '$app/paths'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		selection,
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
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.AtprotoPost>
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

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
			<code>$$thread</code> lists ancestor and reply posts around this at-URI from Atproto_Xrpc <code>getPostThread</code> responses.
		</p>
		<p>
			Ordering follows record <code>createdAt</code> when available; empty lists mean no parent or replies were returned within the fetched depth window.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [
							Source.Atproto_Xrpc,						],
						limit,
					})}
				placeholderText={`Loading ${title.toLowerCase()}…`}
			>
				{#snippet children(thread)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.AtprotoPost}
						id={`${id}-items`}
						href={href}
						{title}
						open={true}
						getKey={(atprotoPost) => atprotoPost.entitySelector.uri}
						getSortValue={(atprotoPost) => atprotoPost.entitySelector.uri}
						placeholderText={`Loading ${title.toLowerCase()}…`}
						items={thread.entities}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No thread posts yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<a
								href={resolve('/(social)/(atproto)/atproto/post/[...uri]', {
									uri: encodeURIComponent(item.entitySelector.uri),
								})}
							>
								<TruncatedValue
									value={item.entitySelector.uri}
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
