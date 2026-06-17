<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	// State
	let {
		entityFieldReference,
		title = 'Nodes',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<{
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.LightningNode>
		title?: string
		open?: boolean
		id: string
		href?: string
	}, Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>> = $props()

	import { proxy } from '$/routes/+layout.svelte'

	

	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<EntitiesList entityType={EntityType.LightningNode} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
				).field(entityFieldReference.fieldName, {
					sources: [Source.LightningMempoolSpace_Rest, Source.LightningLnd_Rest],
					limit: 32,
				})} placeholderText="Loading nodes…">
				{#snippet children(nodes)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.LightningNode}
						id={`${id}-lightning-nodes`}
						href={href}
						getKey={(node) => node.entitySelector.publicKey}
						getSortValue={(node) => node.entitySelector.publicKey}
						open={true}
						items={nodes.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}<p data-text="muted">No nodes listed yet.</p>{/snippet}
						{#snippet Item({ item })}
							<LightningNodeView selector={item.entitySelector} layout={EntityLayout.Summary} />
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
