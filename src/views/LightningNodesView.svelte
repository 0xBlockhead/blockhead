<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

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

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<EntitiesList entityType={EntityType.LightningNode} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet body()}
		{#if open}
			{@const parent = useEntity(entityFieldReference.entityType, entityFieldReference.entityId, { [entityFieldReference.fieldName]: { $: [Source.LightningMempoolSpace_Rest, Source.LightningLnd_Rest], $limit: 32 } })}
			{@const nodes = derive(parent, (parent): Entity<typeof schema, EntityType.LightningNode>[] => (parent[entityFieldReference.fieldName] ?? []).slice(0, 32))}
			<EntitiesList collapsible={false} showSummary={false} entityType={EntityType.LightningNode} id={`${id}-items`} href={href} getKey={(node) => stringify(node[EntityMetaKey.Id])} getSortValue={(node) => stringify(node[EntityMetaKey.Id])} open={true} resource={nodes} {title} UnorderedListProps={{ orientation: ListOrientation.Column }}>
				{#snippet Empty()}<p data-text="muted">No nodes listed yet.</p>{/snippet}
				{#snippet Item(context)}
					<LightningNodeView entityId={context!.item[EntityMetaKey.Id]} layout={EntityLayout.Summary} open={false} />
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
