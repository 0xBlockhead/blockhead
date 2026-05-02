<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


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
			entityId: EntityId<typeof schema, EntityType.ActorCoin>
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

	const actorCoinIdKey = $derived(
		stringify(entityId),
	)

	const actorCoinQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.ActorCoin] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						actorCoinIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => actorCoinIdKey],
	)

	const actorCoinRow = $derived(
		actorCoinQuery.data?.[0]?.row,
	)

	const actorCoinField = $derived(
		(() => {
			const bag = actorCoinRow?.[EntityMetaKey.Fields]
			if (bag === undefined || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				symbol: typeof b.symbol === 'string' && b.symbol.length ? b.symbol : undefined,
				decimals: typeof b.decimals === 'number' ? b.decimals : undefined,
				balance: typeof b.balance === 'bigint' ? b.balance : undefined,
			}
		})(),
	)

	// Components
	import Address from '$/views/Address.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntityView
	entityType={EntityType.ActorCoin}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={actorCoinField?.symbol ?? 'Balance'}
>
	{#snippet Content()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Owner</dt>
				<dd>
					<Address
						network={entityId.$actor.$network}
						address={entityId.$actor.address}
					/>
				</dd>
			</div>
			<div>
				<dt>Asset</dt>
				<dd>
					{#if entityId.$coinInstance.type === CoinInstanceType.NativeCurrency}
						Native currency
					{:else if entityId.$coinInstance.type === CoinInstanceType.Erc20Token}
						<Address
							network={entityId.$coinInstance.$contract.$network}
							address={entityId.$coinInstance.$contract.address}
						/>
					{:else}
						—
					{/if}
				</dd>
			</div>
			{#if actorCoinField?.balance !== undefined}
				<div>
					<dt>Balance</dt>
					<dd>{String(actorCoinField.balance)}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.ActorCoin}
				{entityId}
			>
				<QueryBoundary
					query={actorCoinQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No balance data for this account and coin yet.
						</p>
					{:else}
						<dl>
							{#if actorCoinField?.symbol !== undefined}
								<div>
									<dt>Symbol</dt>
									<dd>{actorCoinField.symbol}</dd>
								</div>
							{/if}
							{#if actorCoinField?.decimals !== undefined}
								<div>
									<dt>Decimals</dt>
									<dd>{String(actorCoinField.decimals)}</dd>
								</div>
							{/if}
							{#if actorCoinField?.balance !== undefined}
								<div>
									<dt>Balance (raw)</dt>
									<dd>{String(actorCoinField.balance)}</dd>
								</div>
							{/if}
						</dl>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
