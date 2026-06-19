<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type LightningNodesResource = EntityProxyEntitiesResource<
		typeof schema,
		EntityType.LightningNode
	>

	// State
	let {
		selection,
		title = 'Nodes',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<{
		selection: LightningNodesResource
		title?: string
		open?: boolean
		id: string
		href?: string
	}, Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>> = $props()

	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<EntitiesList entityType={EntityType.LightningNode} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={selection} placeholderText="Loading nodes…">
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
						items={nodes.values}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}<p data-text="muted">No nodes listed yet.</p>{/snippet}
						{#snippet Item({ item })}
							<LightningNodeView selection={select(EntityType.LightningNode, item.entitySelector)} layout={EntityLayout.Summary} />
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
