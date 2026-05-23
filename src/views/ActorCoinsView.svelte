<script lang="ts">
	// Types/constants
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'

	let {
		entityFieldReference,
		title = 'Balances',
		open = $bindable(true),
		collapsible = true,
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


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const pathNativeCoin = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ActorCoinView from '$/views/ActorCoinView.svelte'
</script>


<EntitiesList
	entityType={EntityType.ActorCoin}
	{title}
	bind:open
	{collapsible}
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

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(
				entityFieldReference.entityType,
				entityFieldReference.entityId,
				{
					$: [
						Source.Allium_Rest,
					],
					[entityFieldReference.fieldName]: {
						$: [
							Source.Allium_Rest,
						],
					},
				},
			)}
			{@const tokenBalances = derive(
				parent,
				(parent) => {
					const rows: Entity<typeof schema, EntityType.ActorCoin>[] = (
						parent[entityFieldReference.fieldName] ?? []
					)
					return (
						rows.map((value) => ({
							value,
						}))
					)
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.ActorCoin}
				{title}
				open={true}
				getKey={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				getSortValue={(envelope) => stringify(envelope.value[EntityMetaKey.Id])}
				placeholderKeys={new SvelteSet<string>()}
				placeholderText={`Loading ${title.toLowerCase()}…`}
				resource={tokenBalances}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
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
		{/if}
	{/snippet}
</EntitiesList>
