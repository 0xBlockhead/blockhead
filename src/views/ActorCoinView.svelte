<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


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
			| 'Heading'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const actorCoin = useEntity(
		EntityType.ActorCoin,
		entityId,
		{
			$: [Source.Allium_Rest],
			symbol: {},
			decimals: {},
			balance: {},
			usdValue: {},
		},
	)


	// Components
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import Address from '$/views/Address.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.ActorCoin}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={actorCoin}
			placeholderText="Loading balance…"
		>
			{#snippet children(u)}
				<HeadingComponent>
					{u.symbol ?? 'Balance'}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Owner</dt>
				<dd>
					<ActorNetworkView
						entityId={{
							$network: entityId.$coinInstance.$network,
							$actor: entityId.$actor,
						}}
						href={resolve(
							'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
							{
								networkId: String(entityId.$coinInstance.$network.chainId),
								address: entityId.$actor.address,
							},
						)}
						layout={EntityLayout.Id}
						open={false}
						showTypeAnnotation={false}
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
			<ResourceBoundary
				resource={actorCoin}
				placeholderText="Loading balance…"
			>
				{#snippet children(u)}
					{#if u.balance !== undefined}
						<div>
							<dt>Balance</dt>
							<dd>{String(u.balance)}</dd>
						</div>
					{/if}
					{#if u.usdValue !== undefined}
						<div>
							<dt>USD value</dt>
							<dd>{String(u.usdValue)}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
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
				<ResourceBoundary
					resource={actorCoin}
					placeholderText="Loading balance…"
				>
					{#snippet children(u)}
						{#if u.symbol == null && u.decimals == null && u.balance == null}
							<p data-text="muted">
								No balance data for this account and coin yet.
							</p>
						{:else}
							<dl>
								{#if u.symbol !== undefined}
									<div>
										<dt>Symbol</dt>
										<dd>{u.symbol}</dd>
									</div>
								{/if}
								{#if u.decimals !== undefined}
									<div>
										<dt>Decimals</dt>
										<dd>{String(u.decimals)}</dd>
									</div>
								{/if}
								{#if u.usdValue !== undefined}
									<div>
										<dt>USD value</dt>
										<dd>{String(u.usdValue)}</dd>
									</div>
								{/if}
							</dl>
						{/if}
					{/snippet}
				</ResourceBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
