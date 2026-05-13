<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

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
			const rows = (
				(
					merged[entityFieldReference.fieldName as keyof typeof merged]
					?? []
				) as Entity<typeof schema, EntityType.BlockheadSource>[]
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.BlockheadSource}
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	{href}
	{id}
	placeholderKeys={new SvelteSet()}
	resource={sources}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No sources yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const srcId = props.item.value[EntityMetaKey.Id]}
			<BlockheadSourceView
				href={resolve(
					'/~/(manage)/manage/(sources)/source/[sourceId]',
					{ sourceId: srcId.id },
				)}
				layout={EntityLayout.Summary}
				open={false}
				sourceId={srcId.id}
				title="Source"
			/>
		{/if}
	{/snippet}
</EntitiesList>
