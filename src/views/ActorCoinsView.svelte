<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
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
		title = 'Balances',
		open = $bindable(true),
		...entitiesListRest
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.ActorCoin>
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()

	const pathNativeCoin = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

	const parent = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		(
			open ?
				{
					[entityFieldReference.fieldName]: {
						$: [
							Source.Allium_Rest,
						],
					},
				}
			:
				{
					$: [
						Source.Allium_Rest,
					],
				}
		),
	)

	const tokenBalances = derive(
		parent,
		(parent) => {
			const rows: Entity<typeof schema, EntityType.ActorCoin>[] = (
				parent[entityFieldReference.fieldName] ?? []
			)
				.toSorted((a, b) => (
					stringify(a[EntityMetaKey.Id]).localeCompare(stringify(b[EntityMetaKey.Id]))
				))
			return (
				rows.map((value) => ({
					value,
				}))
			)
		},
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ActorCoinView from '$/views/ActorCoinView.svelte'
</script>


<EntitiesList
	entityType={EntityType.ActorCoin}
	{title}
	bind:open
	getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
	placeholderKeys={new SvelteSet<string>()}
	placeholderText={`Loading ${title.toLowerCase()}…`}
	resource={tokenBalances}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
	{...entitiesListRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Each row is a token balance for an address on a specific chain (native asset or ERC-20 style contract).
		</p>
		<p>
			Totals come from execution-layer address indexers; beacon-chain validator balances and rewards use a different accounting model.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No balances yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const id = props.item.value[EntityMetaKey.Id]}
			<ActorCoinView
				entityId={id}
				href={resolve('/~/(accounts)/accounts/(balances)/balance/[chainId]/[owner]/[coin]', {
					chainId: String(id.$coinInstance.$network.chainId),
					owner: id.$actor.address,
					coin: (
						id.$coinInstance.type === CoinInstanceType.Erc20Token ?
							id.$coinInstance.$contract.address
						:
							pathNativeCoin
					),
				})}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
