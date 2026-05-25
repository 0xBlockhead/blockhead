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
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Props
	let {
		entityFieldReference,
		id = 'profiles',
		title = 'Farcaster profiles',
		open = $bindable(true),
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.FarcasterUser>
			id?: string
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'body'
			| 'collapsible'
			| 'CollapsibleProps'
			| 'Empty'
			| 'getKey'
			| 'getSortValue'
			| 'HeadingProps'
			| 'href'
			| 'Item'
			| 'ItemPlaceholder'
			| 'items'
			| 'layout'
			| 'limit'
			| 'panelStyle'
			| 'placeholderKeys'
			| 'placeholderText'
			| 'resource'
			| 'showSummary'
			| 'TypeAnnotationTooltip'
			| 'UnorderedListProps'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: [
					Source.Snapchain_Rest,
				],
			},
		},
	)

	const users = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.FarcasterUser>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
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
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<EntitiesList
	entityType={EntityType.FarcasterUser}
	{id}
	{title}
	bind:open
	getKey={(envelope) => envelope.value[EntityMetaKey.Id].fid}
	getSortValue={(envelope) => envelope.value[EntityMetaKey.Id].fid}
	placeholderKeys={new SvelteSet<number>()}
	placeholderText="Loading profiles…"
	resource={users}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Farcaster profiles are on-chain-anchored identities keyed by numeric FID, with off-chain social graph data on hubs.
		</p>
		<p>
			A single directory response is always a bounded subset (e.g. one hub’s registry snapshot)—never the entire protocol user set in one page.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No profiles in this slice yet.
		</p>
	{/snippet}

	{#snippet Item({ item })}
		{@const userId = item.value[EntityMetaKey.Id]}
		<FarcasterUserView
			entityId={{ fid: userId.fid }}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
