<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ethereumExecutionForkByChainIdAndForkId } from '$/constants/EthereumExecutionForks.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import NetworkForkView from '$/views/NetworkForkView.svelte'


	// Props
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
		return {
			chainId,
			forkId,
			slug: catalog?.slug,
		}
	}

	const forkSortValue = (
		entity: { [EntityMetaKey.Id]: EntityId<typeof schema, EntityType.NetworkFork> },
	) => {
		const { chainId, forkId } = forkListLink(
			entity[EntityMetaKey.Id],
		)
		const catalog = ethereumExecutionForkByChainIdAndForkId[`${chainId}:${forkId}`]
		if (catalog === undefined) {
			return 0
		}
		return (
			catalog.activationBlock != null ? catalog.activationBlock
			: catalog.activationTimestamp != null ? catalog.activationTimestamp
			: catalog.activationEpoch != null ? catalog.activationEpoch
			:
				0
		)
	}

	const networkId = (
		entityFieldReference.entityType === EntityType.Network ?
			entityFieldReference.entityId
		:
			(() => {
				throw new Error('ForksView: expected Network parent')
			})()
	)

	const forksParent = useEntity(
		EntityType.Network,
		networkId,
		{
			$: [
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
			$$forks: {
				$: [
					Source.Constants_Internal,
				],
				$limit: 512,
			},
		},
	)

	const forks = derive(
		forksParent,
		(merged) => (
			merged.$$forks
				.toSorted((first, second) => (
					forkSortValue(first)
					- forkSortValue(second)
				))
				.map((value) => ({
					value,
				}))
		),
	)
</script>


<EntitiesList
	entityType={EntityType.NetworkFork}
	{title}
	bind:open
	getKey={(line) => stringify(line.value[EntityMetaKey.Id])}
	getSortValue={(line) => forkSortValue(line.value)}
	placeholderKeys={new SvelteSet()}
	placeholderText="Loading forks…"
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
		{#if props.item}
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
