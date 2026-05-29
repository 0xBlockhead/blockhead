<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromNetworkId } from '$/lib/caip.ts'


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


	// State
	let {
		title = 'Gas estimates',
		open = $bindable(true),
		entityFieldReference,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmNetwork_GasEstimate_Timestamp>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'CollapsibleProps'
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
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
			[entityFieldReference.fieldName]: {
				$: [
					Source.Blockscout_Rest,
					Source.Etherscan_Rest,
				],
				$limit: 64,
			},
		},
	)

	const rows = derive(
		parent,
		(parent) => {
			const list: Entity<typeof schema, EntityType.EvmNetwork_GasEstimate_Timestamp>[] = (
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
	import EvmNetwork_GasEstimate_TimestampView from '$/views/EvmNetwork_GasEstimate_TimestampView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	entityType={EntityType.EvmNetwork_GasEstimate_Timestamp}
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => (
		-Number(row.value[EntityMetaKey.Id].timestampMs)
	)}
	placeholderKeys={new SvelteSet<string>()}
	placeholderText="Loading gas estimates…"
	resource={rows}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row is a timestamped explorer-oracle gas snapshot with suggested slow, average, and fast tiers in gwei.
		</p>
		<p>
			Rows may come from Blockscout stats or Etherscan <code>gasoracle</code>.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No gas estimate snapshots yet.
		</p>
	{/snippet}

	{#snippet Item({ item })}
		{@const row = item.value}
		<EvmNetwork_GasEstimate_TimestampView
			entityId={row[EntityMetaKey.Id]}
			href={resolve(
				'/(explore)/network/[caip2Namespace]:[caip2Reference]',
				{ ...caip2RouteParamsFromNetworkId(row[EntityMetaKey.Id].$network) },
			)}
			id={stringify(row[EntityMetaKey.Id])}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
