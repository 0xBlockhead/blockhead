<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity, EntityId } from '$/schema/$schema.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { ethereumExecutionForkByChainIdAndForkId } from '$/constants/EthereumExecutionForks.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	let {
		entityFieldReference,
		title = 'Forks',
		open = $bindable(true),
		...entitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.NetworkFork>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// Functions
	const forkListLink = (id: EntityId<typeof schema, EntityType.NetworkFork>) => {
		const chainId = id.$network.chainId
		const forkId = id.forkId
		const catalog = ethereumExecutionForkByChainIdAndForkId[`${chainId}:${forkId}`]
		return (
			{
				chainId,
				forkId,
				slug: catalog?.slug,
			}
		)
	}

	const forkSortValue = (row: Entity<typeof schema, EntityType.NetworkFork>) => {
		const { chainId, forkId } = forkListLink(
			row[EntityMetaKey.Id],
		)
		const catalog = ethereumExecutionForkByChainIdAndForkId[`${chainId}:${forkId}`]
		if (catalog === undefined) {
			return (
				0
			)
		}
		return (
			catalog.activationBlock != null ?
				catalog.activationBlock
			: catalog.activationTimestamp != null ?
				catalog.activationTimestamp
			: catalog.activationEpoch != null ?
				catalog.activationEpoch
			:
				0
		)
	}

	const parentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			[entityFieldReference.fieldName]: {
				$: [
					Source.Constants_Internal,
				],
			},
		},
	)

	const forks = derive(
		parentEntity,
		(merged) => {
			const rows = (
				(
					merged[entityFieldReference.fieldName as keyof typeof merged]
					?? []
				) as Entity<typeof schema, EntityType.NetworkFork>[]
			)
			return (
				rows.map((value) => ({
					value,
				}))
					.toSorted((a, b) => (
						forkSortValue(a.value) - forkSortValue(b.value)
					))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NetworkForkView from '$/views/NetworkForkView.svelte'
</script>


<EntitiesList
	entityType={EntityType.NetworkFork}
	{title}
	bind:open
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => forkSortValue(envelope.value)}
	placeholderKeys={new SvelteSet()}
	resource={forks}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			No forks cataloged for this chain yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.isPlaceholder === false}
			{@const link = forkListLink(props.item.value[EntityMetaKey.Id])}
			<NetworkForkView
				entityId={{
					$network: { chainId: link.chainId },
					forkId: link.forkId,
				}}
				href={resolve(
					'/(explore)/(networks)/network/[networkId]/(network)/(forks)/fork/[forkSlug]',
					{
						networkId: String(link.chainId),
						forkSlug: link.slug ?? link.forkId,
					},
				)}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
