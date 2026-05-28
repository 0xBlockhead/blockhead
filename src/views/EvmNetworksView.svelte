<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'

	import {
		ethereumChainId,
		l2BeatProjectChainIds,
	} from '$/sources/L2Beat/Rest/constants.ts'

	import { Source } from '$/sources/$Source.ts'
	import { stringify as stringifyId } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// State
	let {
		title = 'EVM networks',
		open = $bindable(true),
		entityFieldReference,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmNetwork>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'collapsible'
			| 'id'
			| 'href'
		>
	> = $props()


	// State
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const sortValueByChainId = new Map<number, number>([
		[ethereumChainId, 0],
		...l2BeatProjectChainIds.map(({ chainId }, index): [number, number] => (
			[
				chainId,
				index + 1,
			]
		)),
	])

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.L2Beat_Rest,
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			],
			[entityFieldReference.fieldName]: {
				$limit: 4096,
			},
		},
	)

	const networks = derive(
		parent,
		(parent) => {
			const chainIds = new SvelteSet<number>()
			const rows: Entity<typeof schema, EntityType.EvmNetwork>[] = parent[entityFieldReference.fieldName] ?? []
			return (
				rows
					.flatMap((value) => {
						const chainId = Number(value[EntityMetaKey.Id].caip2.reference)
						if (chainIds.has(chainId)) return []
						chainIds.add(chainId)
						return [{ value }]
					})
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmNetwork}
	{title}
	bind:open
	getKey={(line) => stringifyId(line.value[EntityMetaKey.Id])}
	getSortValue={(line) => (
		sortValueByChainId.get(Number(line.value[EntityMetaKey.Id].caip2.reference))
		?? Number.MAX_SAFE_INTEGER + Number(line.value[EntityMetaKey.Id].caip2.reference)
	)}
	placeholderKeys={new SvelteSet<string | number>()}
	placeholderText="Loading EVM networks…"
	resource={networks}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Execution networks are identified by EIP-155 chain id; public registries publish RPC URLs, explorers, and native currency symbols.
		</p>
		<p>
			Testnets, rollups, and app-chains reuse the same abstraction—only consensus parameters and fork schedules differ.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No networks match this list yet.
		</p>
	{/snippet}

	{#snippet Item({ item: line })}
		<EvmNetworkView
			entityId={line.value[EntityMetaKey.Id]}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
