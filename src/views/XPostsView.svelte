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
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		id,
		open = $bindable(true),
		title = 'X posts',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.XPost>
			id: string
			open?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'body'
			| 'collapsible'
			| 'CollapsibleProps'
			| 'Empty'
			| 'HeadingProps'
			| 'href'
			| 'layout'
			| 'panelStyle'
			| 'placeholderText'
			| 'showSummary'
			| 'TypeAnnotationTooltip'
			| 'UnorderedListProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [Source.Constants_Internal],
			[entityFieldReference.fieldName]: {
				$: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				],
			},
		},
	)

	const posts = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.XPost>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
			return (
				rows
					.map((value) => ({
						value,
					}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import XPostView from '$/views/XPostView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	entityType={EntityType.XPost}
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => row.value[EntityMetaKey.Id].id}
	{id}
	resource={posts}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Public posts on X (Twitter).
		</p>
		<p>
			Not Reddit threads, blob storage, pools, candle data, chats, or logs. Live lookup depends on OAuth or bearer credentials and X developer API availability.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No X posts in this list yet.
		</p>
	{/snippet}

	{#snippet Item({ item })}
		<XPostView
			entityId={{ id: item.value[EntityMetaKey.Id].id }}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
