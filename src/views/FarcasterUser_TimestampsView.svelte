<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// State
	let {
		entityFieldReference,
		href,
		id,
		title = 'Metric snapshots',
		open = $bindable(false),
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterUser_Timestamp>
		href: string
		id: string
		title?: string
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Snapchain_Rest,
			],
			[entityFieldReference.fieldName]: {
				$: [
					Source.Snapchain_Rest,
				],
				$limit: 64,
			},
		},
	)

	const rows = derive(
		parent,
		(parent) => {
			const list: Entity<typeof schema, EntityType.FarcasterUser_Timestamp>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
			return list.map((value) => ({
				value,
			}))
		},
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import FarcasterUser_TimestampView from '$/views/FarcasterUser_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FarcasterUser_Timestamp}
	{href}
	{id}
	bind:open
	resource={rows}
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => -row.value[EntityMetaKey.Id].timestampMs}
	placeholderKeys={new SvelteSet<string>()}
	placeholderText="Loading metric snapshots..."
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Timestamped social metric snapshots captured from provider-visible counters.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No snapshots yet.
		</p>
	{/snippet}

	{#snippet Item({ item })}
		<FarcasterUser_TimestampView
			entityId={item.value[EntityMetaKey.Id]}
			{href}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		/>
	{/snippet}
</EntitiesList>
