<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'


	// Props
	let {
		entityFieldReference,
		title = 'Blocks',
		open = $bindable(true),
		collapsible = true,
		id,
		href,
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmBlock>
			title?: string
			open?: boolean
			collapsible?: boolean
			id: string
			href: string
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
</script>


<EntitiesList
	entityType={EntityType.EvmBlock}
	{id}
	{href}
	{title}
	bind:open
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Execution blocks group ordered transactions under one header: gas usage, fee market, and parent hash linkage.
		</p>
		<p>
			Receipts carry receipt logs (<code>LOG</code> opcodes) with indexed topics; blob transactions add data availability commitments without changing how contracts are decoded.
		</p>
		<p>
			Recent block lists are often capped for RPC cost.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			{@const fieldName = entityFieldReference.fieldName}
			{@const network = useEntity(
				EntityType.Network,
				entityFieldReference.entityId,
				{
					blockHeight: {
						$: [
							Source.Voltaire_JsonRpc,
						],
					},
					[fieldName]: {
						$: [
							Source.Voltaire_JsonRpc,
						],
						$limit: 16,
					},
				},
			)}
			{@const blocks = derive(
				network,
				(network): Entity<typeof schema, EntityType.EvmBlock>[] => (
					(network[fieldName] ?? []).slice(0, 16)
				),
			)}
			<div data-column="gap-3">
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmBlock}
					id={`${id}-items`}
					{href}
					{title}
					open={true}
					getKey={(row) => row[EntityMetaKey.Id].blockNumber}
					getSortValue={(row) => (
						-Number(row[EntityMetaKey.Id].blockNumber)
					)}
					placeholderText="Loading execution blocks…"
					resource={blocks}
					UnorderedListProps={{ orientation: ListOrientation.Column }}
				>
					{#snippet Empty()}
						<p data-text="muted">
							No recent blocks yet.
						</p>
					{/snippet}

					{#snippet Item(props)}
						{#if props.item}
							<EvmBlockView
								entityId={props.item[EntityMetaKey.Id]}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
									{
										networkId: String(
											props.item[EntityMetaKey.Id].$network.chainId,
										),
										blockNumber: String(
											props.item[EntityMetaKey.Id].blockNumber,
										),
									},
								)}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/if}
					{/snippet}
				</EntitiesList>
			</div>
		{/if}
	{/snippet}
</EntitiesList>
