<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import {
		type EntityId,
		schema,
	} from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import {
		entityCollectionByEntityType,
	} from '$/collections/$collections.ts'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		Title,
	}: {
		children?: Snippet
		entityId: EntityId<typeof schema, EntityType.Network>
		open?: boolean
		href: string
		layout?: EntityLayout
		Title?: Snippet
	} = $props()


	const chainId = $derived(
		typeof entityId?.chainId === 'number' ?
			entityId.chainId
		:	undefined,
	)

	const networkIdKey = $derived(
		stringify(entityId),
	)

	const networkQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ networkRow: entityCollectionByEntityType[EntityType.Network] })
				.where(({ networkRow }) => (
					eq(
						networkRow[EntityMetaKey.IdKey],
						networkIdKey,
					)
				))
				.select(({ networkRow }) => ({ networkRow }))
		),
		[() => networkIdKey],
	)

	const networkRow = $derived(
		(
			networkQuery.data?.find(
				(row) => row.networkRow[EntityMetaKey.Source] === Source.ChainList,
			)?.networkRow
			?? networkQuery.data?.[0]?.networkRow
		)
	)

	const networkField = $derived(
		(() => {
			const bag = networkRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			return {
				name: typeof b.name === 'string' && b.name.length ? b.name : undefined,
				nativeSymbol: typeof b.nativeSymbol === 'string' && b.nativeSymbol.length ? b.nativeSymbol : undefined,
				explorerOrigin: typeof b.explorerOrigin === 'string' && b.explorerOrigin.length ? b.explorerOrigin : undefined,
				rpcUrl: typeof b.rpcUrl === 'string' && b.rpcUrl.length ? b.rpcUrl : undefined,
			}
		})(),
	)

	const displayName = $derived(
		networkField?.name ?? (
			chainId != null ?
				`Chain ${chainId}`
			:
				'Network'
		),
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import Heading from '$/components/Heading.svelte'
	import NetworkForksView from '$/views/NetworkForksView.svelte'
</script>


<EntityView
	entityType={EntityType.Network}
	{entityId}
	{href}
	title={displayName}
	{layout}
	{open}
>
	{#snippet SummaryHeading()}
		<Heading>
			{#if href}
				<a href={resolve(href)}>
					{#if Title}
						{@render Title()}
					{:else}
						{displayName}
					{/if}
				</a>
			{:else if Title}
				{@render Title()}
			{:else}
				{displayName}
			{/if}
		</Heading>
	{/snippet}

	{#snippet SummaryContent()}
		{#if chainId != null}
			<dl data-definition-list="vertical">
				<div>
					<dt>Chain ID</dt>
					<dd>{String(chainId)}</dd>
				</div>
				<div>
					<dt>CAIP-2</dt>
					<dd>
						eip155:{chainId}
					</dd>
				</div>
				{#if networkField?.nativeSymbol != null}
					<div>
						<dt>Currency</dt>
						<dd>{networkField.nativeSymbol}</dd>
					</div>
				{/if}
			</dl>
		{/if}
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Network}
			{entityId}
		>
			<QueryBoundary

				query={networkQuery}


			>


				{#snippet children(rows)}
					{@const networkRow = (
						rows?.find(
							(row) => row.networkRow[EntityMetaKey.Source] === Source.ChainList,
						)?.networkRow
						?? rows?.[0]?.networkRow
					)}
					{#if networkRow == null}
						<p data-text="muted">
							No network row in collections yet (resolve ChainList / Blockscout for this chain).
						</p>
					{:else}
						<dl>
							{#if networkField?.explorerOrigin != null}
								<div>
									<dt>Block explorer</dt>
									<dd>
										<a
											href={networkField.explorerOrigin}
											rel="noreferrer"
											target="_blank"
										>
											{networkField.explorerOrigin}
										</a>
									</dd>
								</div>
							{/if}
							{#if networkField?.rpcUrl != null}
								<div>
									<dt>RPC</dt>
									<dd>{networkField.rpcUrl}</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}

			</QueryBoundary>
		</EntityDetails>

		{#if chainId != null}
			<EvmBlocksView
				entityId={entityId}
				href={resolve('/(explore)/(networks)/network/[networkId]/(network)/blocks', {
					networkId: String(chainId),
				})}
				id={`${networkIdKey}:blocks`}
				open={false}
			/>

			<EvmTransactionsView
				entityId={entityId}
				href={resolve('/(explore)/(networks)/network/[networkId]/(network)/transactions', {
					networkId: String(chainId),
				})}
				id={`${networkIdKey}:transactions`}
				open={false}
			/>

			<NetworkForksView
				entityId={entityId}
				href={resolve('/(explore)/(networks)/network/[networkId]/(network)/forks', {
					networkId: String(chainId),
				})}
				id={`${networkIdKey}:forks`}
				open={false}
			/>
		{/if}

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
