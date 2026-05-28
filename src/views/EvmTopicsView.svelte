<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		open = $bindable(true),
		collapsible = true,
		title = 'Log topics',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmTopic>
			open?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'id',
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmTopicView from '$/views/EvmTopicView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmTopic}
	{title}
	bind:open
	{collapsible}	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Log topics are 32-byte words in receipt logs. Topic 0 often matches a keccak hash of an ABI log signature, but raw <code>LOG</code> emissions are not required to follow that convention.
		</p>
		<p>
			They are distinct from four-byte function selectors on calldata.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No indexed log topics yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Local_Internal,
					],
					[entityFieldReference.fieldName]: {
						$limit: 4096,
					},
				},
			)}
			{@const topics = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.EvmTopic>[] = (
						parent[entityFieldReference.fieldName]
						?? []
					)
					return rows
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmTopic}
				getKey={(topic) => topic[EntityMetaKey.Id].hex}
				getSortValue={(topic) => topic[EntityMetaKey.Id].hex}
				placeholderText="Loading indexed log topics…"
				resource={topics}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				{title}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No indexed log topics yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<EvmTopicView
						entityId={item[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
						collapsible={false}
						showTypeAnnotation={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
