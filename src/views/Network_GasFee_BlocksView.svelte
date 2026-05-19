<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import Network_GasFee_BlockView from '$/views/Network_GasFee_BlockView.svelte'


	// Props
	let {
		title = 'Gas',
		open = $bindable(true),
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Network_GasFee_Block>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	const fieldName = entityFieldReference.fieldName

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Constants_Internal,
				Source.Voltaire_JsonRpc,
			],
			[fieldName]: {
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
			const list: Entity<typeof schema, EntityType.Network_GasFee_Block>[] = (
				parent[fieldName] ?? []
			)
			return (
				list
					.map((value) => ({
						value,
					}))
			)
		},
	)
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.Network_GasFee_Block}
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
			Each row is keyed by an execution block height; fee-history fields describe the EIP-1559 fee market at that height from <code>eth_feeHistory</code>.
		</p>
		<p>
			Legacy gas price and max priority fee calls reflect the RPC’s current tip hints when the snapshot resolves, not necessarily historical values at older heights.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No gas snapshots yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const row = props.item.value}
			{@const id = row[EntityMetaKey.Id]}
			<Network_GasFee_BlockView
				entityId={id}
				href={resolve(
					'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
					{
						networkId: String(id.$network.chainId),
						blockNumber: String(id.blockNumber),
					},
				)}
				id={stringify(id)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
