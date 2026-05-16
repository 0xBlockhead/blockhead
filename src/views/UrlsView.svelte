<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import UrlView from '$/views/UrlView.svelte'


	// Props
	let {
		entityFieldReference,
		fieldSources,
		title = 'URLs',
		emptyText = 'No URLs listed yet.',
		open = $bindable(true),
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Url>
			fieldSources: readonly Source[]
			title?: string
			emptyText?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: fieldSources,
			},
		},
	)

	const urls = derive(
		parentEntity,
		(merged) => {
			const rows: Entity<typeof schema, EntityType.Url>[] = (
				merged[entityFieldReference.fieldName] ?? []
			)
			const byUrl = new Map<string, Entity<typeof schema, EntityType.Url>>()
			for (const row of rows) {
				const key = row[EntityMetaKey.Id].url
				if (byUrl.has(key)) continue
				byUrl.set(key, row)
			}
			return (
				[...byUrl.values()]
					.toSorted((left, right) => (
						left[EntityMetaKey.Id].url.localeCompare(right[EntityMetaKey.Id].url)
					))
					.map((value) => ({ value }))
			)
		},
	)
</script>


<EntitiesList
	entityType={EntityType.Url}
	{title}
	bind:open
	getKey={(envelope) => envelope.value[EntityMetaKey.Id].url}
	getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].url}
	placeholderKeys={new SvelteSet()}
	resource={urls}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			{emptyText}
		</p>
	{/snippet}

	{#snippet Item({ item: envelope })}
		{#if envelope}
			<UrlView
				entityId={envelope.value[EntityMetaKey.Id]}
				href={envelope.value[EntityMetaKey.Id].url}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
