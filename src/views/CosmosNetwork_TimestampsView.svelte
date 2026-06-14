<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Network snapshots',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.CosmosNetwork_Timestamp>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CosmosNetwork_TimestampView from '$/views/CosmosNetwork_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.CosmosNetwork_Timestamp}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Cosmos network snapshots capture observed SDK and CometBFT state such as latest block, sync state, validator totals, and governance counts.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.CosmosSdk_Rest,
							Source.CometBft_Rest,
						],
						limit: 16,
					},
				} }),
			)}
			{@const timestamps = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.CosmosNetwork_Timestamp>[] => (
					(parent.fields[entityFieldReference.fieldName]?.values ?? [])
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.CosmosNetwork_Timestamp}
				id={`${id}-items`}
				href={href}
				getKey={(timestamp) => stringify(timestamp[EntityMetaKey.Selector])}
				getSortValue={(timestamp) => -timestamp[EntityMetaKey.Selector].timestampMs}
				open={true}
				resource={timestamps}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">No network snapshots yet.</p>
				{/snippet}

				{#snippet Item(context)}
					<CosmosNetwork_TimestampView selector={context!.item[EntityMetaKey.Selector]} layout={EntityLayout.Summary} open={false} />
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
