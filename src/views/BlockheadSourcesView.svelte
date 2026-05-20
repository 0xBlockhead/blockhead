<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import { stringify } from 'devalue'

	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityFieldReference,
		title = 'Resolver sources',
		open = $bindable(true),
		collapsible = true,
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
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<div data-column="gap-2">
	<EntitiesList
		entityType={EntityType.BlockheadSource}
		{href}
		{id}
		{title}
		bind:open
		{collapsible}
		{...entitiesListRest}
	>
		{#snippet TypeAnnotationTooltip()}
			<p>
				Persistent records of data-source transports: base URLs and metadata used for repeated API access (RPC, REST, GraphQL).
			</p>
			<p>
				Browser wallets use EIP-1193 injection instead—address and chain selection there is session state, not an HTTP transport row.
			</p>
		{/snippet}

		{#snippet body()}
			{#if open}
				{@const parent = useEntity(
					entityFieldReference.entityType,
					entityFieldReference.entityId,
					{
						[entityFieldReference.fieldName]: {
							$: [
								Source.Local_Internal,
							],
						},
					},
				)}
				{@const sources = derive(
					parent,
					(parent) => {
						const rows: Entity<typeof schema, EntityType.BlockheadSource>[] = (
							parent[entityFieldReference.fieldName] ?? []
						)
						return (
							rows.map((value) => ({
								value,
							}))
						)
					},
				)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.BlockheadSource}
					{href}
					id={`${id}-items`}
					{title}
					open={true}
					placeholderText="Loading resolver sources…"
					getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
					getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
					resource={sources}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Item({ item: envelope })}
						{#if envelope}
							<BlockheadSourceView
								layout={EntityLayout.Summary}
								open={false}
								sourceId={envelope.value[EntityMetaKey.Id].id}
								title="Resolver source"
								href={resolve(
									'/~/(manage)/manage/(sources)/source/[sourceId]',
									{ sourceId: envelope.value[EntityMetaKey.Id].id },
								)}
							/>
						{/if}
					{/snippet}
				</EntitiesList>
			{/if}
		{/snippet}
	</EntitiesList>
</div>
