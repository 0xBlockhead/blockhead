<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
import { stringify } from 'devalue'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Storage nodes',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
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
	import ZeroGStorageNodeView from '$/views/ZeroGStorageNodeView.svelte'
</script>


<EntitiesList entityType={EntityType.ZeroGStorageNode} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet TypeAnnotationTooltip()}
		<p>Storage nodes provide 0G storage availability and rewards.</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection({
					sources: [
						Source.ZeroGStorageScan_Rest,
					],
					limit: 16,
				})} placeholderText="Loading nodes…">
				{#snippet children(nodes)}
					<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.ZeroGStorageNode}
				id={`${id}-items`}
				href={href}
				getKey={(node) => stringify(node.entitySelector)}
				open={true}
				items={nodes.entities}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">No storage nodes yet.</p>
				{/snippet}

				{#snippet Item({ item })}
					<ZeroGStorageNodeView
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
