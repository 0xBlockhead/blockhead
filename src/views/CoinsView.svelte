<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Functions
	const coinIdFromWire = (coin: unknown) => {
		if (typeof coin !== 'object' || coin === null) return undefined
		if (!(EntityMetaKey.Id in coin)) return undefined
		const id = Reflect.get(coin, EntityMetaKey.Id)
		return (
			typeof id === 'object'
			&& id !== null
			&& 'coinId' in id
			&& typeof Reflect.get(id, 'coinId') === 'string' ?
				String(Reflect.get(id, 'coinId'))
			:
				undefined
		)
	}


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/collections/$collections.ts'

	let {
		title = 'Coins',

		open = $bindable(true),

		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CoinView from '$/views/CoinView.svelte'

	const coinsQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ $$coins: entityFieldCollections[EntityType._Global]['$$coins'] })
				.where(({ $$coins }) => (
					eq(
						$$coins[EntityMetaKey.ParentIdKey],
						stringify({}),
					)
				))
				.select(({ $$coins }) => (
					{
						coin: $$coins[EntityMetaKey.Value],
					}
				))
		),
	)

	const coinRows = $derived(
		[
			...(
				(coinsQuery.data ?? [])
					.reduce(
						(rowsByKey, row) => (
							rowsByKey.set(
								stringify(row.coin[EntityMetaKey.Id]) ?? '',
								row,
							)
						),
						new Map<string, (typeof coinsQuery.data)[number]>(),
					)
					.values()
			),
		],
	)
</script>


<EntitiesList
	entityType={EntityType.Coin}
	{title}
	bind:open
	query={coinsQuery}
	items={new SvelteSet(coinRows)}
	getKey={(row) => stringify(row.coin[EntityMetaKey.Id]) ?? ''}
	getSortValue={(row) => (
		coinIdFromWire(row.coin) ?? ''
	)}
	placeholderKeys={new SvelteSet()}
	unorderedListProps={{ orientation: ListOrientation.Column }}
	{...EntitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			No coins in collections.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			{@const coinId = coinIdFromWire(row.coin)}
			{#if coinId != null}
				<CoinView
					entityId={{
						coinId,
					}}
					href={resolve('/(assets)/(coins)/coin/[coinId]', {
						coinId,
					})}
					layout={EntityLayout.Summary}
					open={false}
				/>
			{:else}
				<span data-text="muted">
					Coin
				</span>
			{/if}
		{/if}
	{/snippet}
</EntitiesList>
