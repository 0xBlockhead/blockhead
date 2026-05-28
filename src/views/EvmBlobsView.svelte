<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		title = 'Blobs',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmBlob>
			title?: string
			open?: boolean
			collapsible?: boolean
			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmBlobView from '$/views/EvmBlobView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmBlob}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Blob transactions carry large binary payloads alongside execution blocks; headers point at commitments while bodies hold the data for rollups.
		</p>
		<p>
			That layer is separate from contract ABI decoding or ENS metadata.
		</p>
		<p>
			Lists sample recent sidecars; nodes may omit blob bodies unless blob RPC is enabled.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parentEntityType = entityFieldReference.entityType}
			{@const parent = useEntity(
				parentEntityType,
				entityFieldReference.entityId,
				{
					...(parentEntityType === EntityType.EvmNetwork && {
						blockHeight: {
							$: [
								Source.Voltaire_JsonRpc,
							],
						},
					}),
					[entityFieldReference.fieldName]: {
						$: [
							Source.Voltaire_JsonRpc,
						],
						...(parentEntityType === EntityType.EvmNetwork && {
							$limit: 8,
						}),
					},
				},
			)}
			{@const blobs = derive(
				parent,
				(parent) => (
					parentEntityType === EntityType.EvmNetwork ?
						(parent[entityFieldReference.fieldName] ?? []).slice(0, 8)
					:
						(parent[entityFieldReference.fieldName] ?? [])
				),
			)}
			<div data-column="gap-3">
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmBlob}
					id={`${id}-items`}
					{title}
					open={true}
					getKey={(row) => stringify(row[EntityMetaKey.Id])}
					getSortValue={(row) => stringify(row[EntityMetaKey.Id])}
					placeholderText="Loading blobs…"
					resource={blobs}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No blobs in this sample yet.
						</p>
					{/snippet}

					{#snippet Item({ item })}
						<EvmBlobView
							entityId={item[EntityMetaKey.Id]}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}
				</EntitiesList>
			</div>
		{/if}
	{/snippet}
</EntitiesList>
