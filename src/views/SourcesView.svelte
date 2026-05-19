<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import EntitiesList from '$/components/EntitiesList.svelte'

	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		title = 'Saved sources',
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


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		(
			open ?
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Local_Internal,
						],
					},
				}
			:
				{}
		),
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


	// Components
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
	{#snippet TypeAnnotationTooltip()}
		<p>
			Saved HTTP or GraphQL base URLs (and related config) used to reach indexers, RPC nodes, or market APIs.
		</p>
		<p>
			They are data-plane endpoints for on-chain and market queries—separate from wallet keys, generic web bookmarks, or object gateways.
		</p>
		<p>
			Storing a named base URL is for repeatable resolver or client configuration—distinct from one-off bookmarks or signing material.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No saved endpoints yet.
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

