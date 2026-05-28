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
	import { caip2RouteParamsFromEvmChainId } from '$/lib/caip.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		title = 'Gas',
		open = $bindable(true),
		entityFieldReference,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmNetwork_GasFee_Block>
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
			const list: Entity<typeof schema, EntityType.EvmNetwork_GasFee_Block>[] = (
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
	import EvmNetwork_GasFee_BlockView from '$/views/EvmNetwork_GasFee_BlockView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	entityType={EntityType.EvmNetwork_GasFee_Block}
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => (
		-Number(row.value[EntityMetaKey.Id].blockNumber)
	)}
	placeholderKeys={new SvelteSet<string>()}
	placeholderText="Loading gas snapshots…"
	resource={rows}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Recent blocks from <code>eth_feeHistory</code>: base fee, fullness ratio, and priority fee at the 50th percentile per height.
		</p>
		<p>
			The head block row also includes suggested gas price and max priority fee from the RPC at resolve time.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No gas snapshots yet.
		</p>
	{/snippet}

	{#snippet Item({ item })}
		{@const row = item.value}
		{@const id = row[EntityMetaKey.Id]}
		<EvmNetwork_GasFee_BlockView
			entityId={id}
			href={resolve(
				'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(blocks)/block/[blockNumber]',
				{
						...caip2RouteParamsFromEvmChainId(id.$network.chainId),
						blockNumber: String(id.blockNumber),
				},
			)}
			id={stringify(id)}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
