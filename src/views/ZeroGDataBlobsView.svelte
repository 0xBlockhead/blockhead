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
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityFieldReference,
		title = 'Data blobs',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.ZeroGDataBlob>
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
	import ZeroGDataBlobView from '$/views/ZeroGDataBlobView.svelte'
</script>


<EntitiesList entityType={EntityType.ZeroGDataBlob} {title} bind:open {id} href={href} {...EntitiesListProps}>
	{#snippet TypeAnnotationTooltip()}
		<p>Data blobs are 0G storage objects keyed by data root and storage log entries.</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(entityCollectionsContext,
				entityFieldReference.entityType,
				entityFieldReference.entityId,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.ZeroGStorageScan_Rest,
						],
						limit: 16,
					},
				} }),
			)}
			{@const blobs = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.ZeroGDataBlob>[] => (
					(parent.fields[entityFieldReference.fieldName]?.values ?? [])
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.ZeroGDataBlob}
				id={`${id}-items`}
				href={href}
				getKey={(blob) => stringify(blob[EntityMetaKey.Id])}
				open={true}
				resource={blobs}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">No data blobs yet.</p>
				{/snippet}

				{#snippet Item(context)}
					<ZeroGDataBlobView
						entityId={context!.item[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
