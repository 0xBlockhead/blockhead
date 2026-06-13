<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		title = 'Resolver sources',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadSource
			>
			title?: string
			open?: boolean
			collapsible?: boolean
			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<div data-column="gap-2">
	<EntitiesList
		entityType={EntityType.BlockheadSource}
	{id}
		{title}
		bind:open
	{collapsible}
		{...EntitiesListProps}
	>
		{#snippet TypeAnnotationTooltip()}
			<p>
				Persistent records of data-source transports: base URLs and metadata used for repeated API access (RPC, REST, GraphQL).
			</p>
			<p>
				Browser wallets use EIP-1193 injection instead—address and chain selection there is session state, not an HTTP transport blockheadSource.
			</p>
		{/snippet}

		{#snippet body({ open: _bodyOpen })}
			{#if open}
				{@const parent = subscribe(entityFieldReference.entityType,
					entityFieldReference.entityId,({ fields: {
						[entityFieldReference.fieldName]: {
							sources: [
								Source.Local_Internal,
							],
						},
					} }),
				)}
				{@const sources = derive(
					parent,
					(parent) => {
						const blockheadSources: readonly Entity<typeof schema, EntityType.BlockheadSource>[] = (
							parent.fields[entityFieldReference.fieldName]?.values ?? []
						)
						return (
							blockheadSources.map((value) => ({
								value,
							}))
						)
					},
				)}
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.BlockheadSource}
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
						<BlockheadSourceView
							layout={EntityLayout.Summary}
							open={false}
							sourceId={envelope.value[EntityMetaKey.Id].id}
							title="Resolver source"
						/>
					{/snippet}
				</EntitiesList>
			{/if}
		{/snippet}
	</EntitiesList>
</div>
