<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type CosmosBlocksResource = EntityProxyEntitiesResource<
		typeof schema,
		EntityType.CosmosBlock
	>
	// State
	let {
		selection,
		title = 'Blocks',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: CosmosBlocksResource
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CosmosBlockView from '$/views/CosmosBlockView.svelte'
</script>


<EntitiesList
	entityType={EntityType.CosmosBlock}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Cosmos blocks are CometBFT consensus blocks containing SDK transactions and evidence.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection} placeholderText="Loading blocks…">
				{#snippet children(blocks)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.CosmosBlock}
						id={`${id}-items`}
						href={href}
						getKey={(block) => stringify(block.entitySelector)}
						getSortValue={(block) => stringify(block.entitySelector)}
						open={true}
						items={blocks.values}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}<p data-text="muted">No recent blocks yet.</p>{/snippet}
						{#snippet Item({ item })}
							<CosmosBlockView
								selection={select(EntityType.CosmosBlock, item.entitySelector)}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
