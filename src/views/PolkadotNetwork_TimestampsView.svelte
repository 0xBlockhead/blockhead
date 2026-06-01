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
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		title = 'Network snapshots',
		open = $bindable(true),
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.PolkadotNetwork_Timestamp>
			title?: string
			open?: boolean
			id: string
			href?: string
		},
		Pick<ComponentProps<typeof EntitiesList>, 'CollapsibleProps'>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import PolkadotNetwork_TimestampView from '$/views/PolkadotNetwork_TimestampView.svelte'
</script>


<EntitiesList
	entityType={EntityType.PolkadotNetwork_Timestamp}
	{title}
	bind:open
	{id}
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>Timestamp polkadotNetworkTimestamps hold observed relay-chain status such as finality and runtime state.</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Polkadot_JsonRpc,
						],
						$limit: 16,
					},
				},
			)}
			{@const timestamps = derive(
				parent,
				(parent): Entity<typeof schema, EntityType.PolkadotNetwork_Timestamp>[] => (
					(parent[entityFieldReference.fieldName] ?? []).slice(0, 16)
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.PolkadotNetwork_Timestamp}
				id={`${id}-items`}
				href={href}
				getKey={(timestamp) => stringify(timestamp[EntityMetaKey.Id])}
				getSortValue={(timestamp) => -Number(timestamp[EntityMetaKey.Id].timestampMs)}
				open={true}
				resource={timestamps}
				{title}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">No network snapshots yet.</p>
				{/snippet}

				{#snippet Item(context)}
					<PolkadotNetwork_TimestampView
						entityId={context!.item[EntityMetaKey.Id]}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
