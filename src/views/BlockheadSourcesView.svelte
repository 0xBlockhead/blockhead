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


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Sources',
		open = $bindable(true),
		href,
		id,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadSource
			>
			title?: string
			open?: boolean
			href: string
			id: string
		},
		Omit<ComponentProps<typeof EntitiesList>, 'entityType'>
	> = $props()


	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: [
					Source.Local_Internal,
				],
			},
		},
	)

	const sources = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.BlockheadSource>[] = (
				merged[entityFieldReference.fieldName] ?? []
			)
				.toSorted((a, b) => (
					stringify(a[EntityMetaKey.Id]).localeCompare(stringify(b[EntityMetaKey.Id]))
				))
			return (
				rows.map((value) => ({
					value,
				}))
			)
		},
	)
</script>


<EntitiesList
	entityType={EntityType.BlockheadSource}
	{href}
	{id}
	{title}
	bind:open
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	resource={sources}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListRest}
>
	{#snippet Item({ item: envelope })}
		{#if envelope}
			<BlockheadSourceView
				layout={EntityLayout.Summary}
				open={false}
				sourceId={envelope.value[EntityMetaKey.Id].id}
				title="Source"
				href={resolve(
					'/~/(manage)/manage/(sources)/source/[sourceId]',
					{ sourceId: envelope.value[EntityMetaKey.Id].id },
				)}
			/>
		{/if}
	{/snippet}
</EntitiesList>
