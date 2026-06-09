<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		entityFieldReference,
		title = 'Transfers',
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.StateChannelTransfer
			>
			title?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import StateChannelTransferView from '$/views/StateChannelTransferView.svelte'
</script>


<EntitiesList
	entityType={EntityType.StateChannelTransfer}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Directed off-chain movements between the two channel participants, ordered by turn.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No transfers on this channel yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(entityCollectionsContext,
				entityFieldReference.entityType,
				entityFieldReference.entityId,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [Source.Local_Internal],
					},
				} }),
			)}
			{@const transfers = derive(
				parent,
				(parent) => (
					[...(parent.fields[entityFieldReference.fieldName]?.values ?? [])]
						.map((value) => ({
							value,
						}))
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.StateChannelTransfer}
				getKey={(line) => stringify(line.value[EntityMetaKey.Id])}
				getSortValue={(line) => (
					stringify(line.value[EntityMetaKey.Id])
				)}
				placeholderText="Loading channel transfers…"
				resource={transfers}
				{title}
				href={EntitiesListProps.href ?? ''}
				id={`${EntitiesListProps.id ?? 'channel-transfers'}:items`}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No transfers on this channel yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const line = item.value}
					{@const transferId = line[EntityMetaKey.Id]}
					<StateChannelTransferView
						entityId={transferId}
						layout={EntityLayout.Summary}
						open={false}
						collapsible={false}
						showParentChannel={false}
						showTypeAnnotation={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
