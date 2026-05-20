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
	import Network_GasEstimate_TimestampView from '$/views/Network_GasEstimate_TimestampView.svelte'


	// Props
	let {
		title = 'Gas estimates',
		open = $bindable(true),
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Network_GasEstimate_Timestamp>
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
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
				Source.Voltaire_JsonRpc,
			],
			[fieldName]: {
				$: [
					Source.Blockscout_Rest,
					Source.Etherscan_Rest,
					Source.Voltaire_JsonRpc,
				],
				$limit: 64,
			},
		},
	)

	const rows = derive(
		parent,
		(parent) => {
			const list: Entity<typeof schema, EntityType.Network_GasEstimate_Timestamp>[] = (
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
	entityType={EntityType.Network_GasEstimate_Timestamp}
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
			Each row is a suggested gas tier snapshot (slow / average / fast in gwei) or a JSON-RPC fee hint at one instant.
		</p>
		<p>
			Rows may come from Blockscout stats, Etherscan <code>gasoracle</code>, or live <code>eth_gasPrice</code> on this chain.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No gas estimate snapshots yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const row = props.item.value}
			<Network_GasEstimate_TimestampView
				entityId={row[EntityMetaKey.Id]}
				href={resolve(
					'/(explore)/(networks)/network/[networkId]',
					{ networkId: String(row[EntityMetaKey.Id].$network.chainId) },
				)}
				id={stringify(row[EntityMetaKey.Id])}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
