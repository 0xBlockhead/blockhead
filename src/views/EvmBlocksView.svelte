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
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmBlock>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const network = useEntity(
		EntityType.Network,
		entityFieldReference.entityId,
		{
			blockHeight: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
			$$blocks: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
		},
	)

	const recentBlocks = derive(
		network,
		(loaded) => {
			const rows = (
				loaded.$$blocks
				?? []
			) as Entity<typeof schema, EntityType.EvmBlock>[]
			return (
				rows
					.toSorted((a, b) => (
						Number(
							b[EntityMetaKey.Id].blockNumber
							- a[EntityMetaKey.Id].blockNumber,
						)
					))
					.slice(0, 16)
			)
		},
	)
</script>


<EntitiesList
	entityType={EntityType.EvmBlock}
	{title}
	bind:open
	{...entitiesListRest}
>
	{#snippet body()}
		{#key stringify(entityFieldReference.entityId)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmBlock}
				id={`${entitiesListRest.id}-items`}
				href={entitiesListRest.href}
				{title}
				open={true}
				getKey={(row) => row[EntityMetaKey.Id].blockNumber}
				placeholderText="Loading blocks…"
				resource={recentBlocks}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No recent blocks for this network yet. Try again shortly.
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
		{/key}
	{/snippet}
</EntitiesList>
