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


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'Mempool',
		open = $bindable(true),
		entityFieldReference,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Network_Txpool_Timestamp>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'id',
			| 'href'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Voltaire_JsonRpc,
			],
			[entityFieldReference.fieldName]: {
				$: [
					Source.Voltaire_JsonRpc,
				],
				$limit: 64,
			},
		},
	)

	const rows = derive(
		parent,
		(parent) => {
			const list: Entity<typeof schema, EntityType.Network_Txpool_Timestamp>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
			return (
				list
					.map((value) => ({
						value,
					}))
			)
		},
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import Network_Txpool_TimestampView from '$/views/Network_Txpool_TimestampView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	entityType={EntityType.Network_Txpool_Timestamp}
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => (
		-Number(row.value[EntityMetaKey.Id].timestampMs)
	)}
	placeholderKeys={new SvelteSet<string>()}
	placeholderText="Loading mempool samples…"
	resource={rows}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row captures how many transactions were waiting in the mempool at one instant—pending versus queued.
		</p>
		<p>
			Samples appear when the execution client exposes txpool inspection for this chain.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No mempool snapshots yet.
		</p>
	{/snippet}

	{#snippet Item({ item })}
		{@const row = item.value}
		<Network_Txpool_TimestampView
			entityId={row[EntityMetaKey.Id]}
			href={resolve(
				'/(explore)/(networks)/network/[networkId]',
				{ networkId: String(row[EntityMetaKey.Id].$network.chainId) },
			)}
			id={stringify(row[EntityMetaKey.Id])}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
