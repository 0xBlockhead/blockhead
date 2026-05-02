<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.CoinInstance>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// (Derived)
	const coinInstanceIdKey = $derived(
		stringify(entityId),
	)

	const coinInstanceQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.CoinInstance] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						coinInstanceIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => coinInstanceIdKey],
	)

	const coinInstanceRow = $derived(
		(
			coinInstanceQuery.data?.find(
				(r) => r.row[EntityMetaKey.Source] === Source.Coingecko_Rest,
			)?.row
			?? coinInstanceQuery.data?.[0]?.row
		),
	)

	const coinInstanceField = $derived(
		(() => {
			const bag = coinInstanceRow?.[EntityMetaKey.Fields]
			if (bag === undefined || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				symbol: typeof b.symbol === 'string' && b.symbol.length ? b.symbol : undefined,
				name: typeof b.name === 'string' && b.name.length ? b.name : undefined,
				decimals: typeof b.decimals === 'number' ? b.decimals : undefined,
				caip19: typeof b.caip19 === 'string' && b.caip19.length ? b.caip19 : undefined,
			}
		})(),
	)

	const displayTitle = $derived(
		coinInstanceField?.symbol
			?? coinInstanceField?.name
			?? (
				entityId.type === CoinInstanceType.NativeCurrency ?
					`Native (${entityId.$network.chainId})`
				:	`ERC-20 (${entityId.$network.chainId})`
			),
	)


	// Components
	import Address from '$/views/Address.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.CoinInstance}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Content()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Chain</dt>
				<dd>
					{String(entityId.$network.chainId)}
				</dd>
			</div>
			<div>
				<dt>Kind</dt>
				<dd>
					{#if entityId.type === CoinInstanceType.NativeCurrency}
						Native
					{:else if entityId.type === CoinInstanceType.Erc20Token}
						<Address
							network={entityId.$contract.$network}
							address={entityId.$contract.address}
						/>
					{:else}
						—
					{/if}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.CoinInstance}
			{entityId}
		>
			<QueryBoundary
				query={coinInstanceQuery}
			>

				{#snippet children(rows)}
					{@const row = (
						rows?.find(
							(r) => r.row[EntityMetaKey.Source] === Source.Coingecko_Rest,
						)?.row
						?? rows?.[0]?.row
					)}
					{#if row === undefined}
						<p data-text="muted">
							No metadata for this deployment yet.
						</p>
					{:else}
						<dl>
							{#if coinInstanceField?.name !== undefined}
								<div>
									<dt>Name</dt>
									<dd>{coinInstanceField.name}</dd>
								</div>
							{/if}
							{#if coinInstanceField?.decimals !== undefined}
								<div>
									<dt>Decimals</dt>
									<dd>{String(coinInstanceField.decimals)}</dd>
								</div>
							{/if}
							{#if coinInstanceField?.caip19 !== undefined}
								<div>
									<dt>CAIP-19</dt>
									<dd>{coinInstanceField.caip19}</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
