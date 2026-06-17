<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Blocks',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NearBlock>
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
	import NearBlockView from '$/views/NearBlockView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NearBlock}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>NEAR blocks collect chunks across shards for Nightshade execution.</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
				).field(entityFieldReference.fieldName, {
					sources: [Source.NearRpc_JsonRpc, Source.NearBlocks_Rest],
					limit: 16,
				})} placeholderText="Loading blocks…">
				{#snippet children(blocks)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.NearBlock}
						id={`${id}-items`}
						href={href}
						getKey={(block) => stringify(block.entitySelector)}
						getSortValue={(block) => -Number(block.entitySelector.height)}
						open={true}
						items={blocks.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}<p data-text="muted">No recent blocks yet.</p>{/snippet}
						{#snippet Item({ item })}
							<NearBlockView
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
