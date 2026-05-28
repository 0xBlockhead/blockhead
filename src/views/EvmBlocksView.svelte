<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		entityFieldReference,
		title = 'Blocks',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmBlock>
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
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmBlock}

	{id}
	{title}
	bind:open
	{...EntitiesListProps}
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

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const network = useEntity(
				EntityType.EvmNetwork,
				entityFieldReference.entityId,
				{
					blockHeight: {
						$: [
							Source.Voltaire_JsonRpc,
						],
					},
					[entityFieldReference.fieldName]: {
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
					(network[entityFieldReference.fieldName] ?? []).slice(0, 16)
				),
			)}
			<div data-column="gap-3">
				<EntitiesList
					collapsible={false}
					showSummary={false}
					entityType={EntityType.EvmBlock}
					id={`${id}-items`}
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

					{#snippet Item({ item })}
						<EvmBlockView
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
