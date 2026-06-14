<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(assets)/(leverage)/position/[positionId]', {
			positionId: selector.id,
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Leverage>
			href?: string
			open?: boolean
		},
		never
	> = $props()

	const leverage = subscribe(EntityType.Leverage,
		selector,
		({ fields: { $pool: true, $owner: true, createdAtTimestamp: true, liquidity: true, origin: true, tickLower: true, tickUpper: true, token0Owed: true, token1Owed: true, tokenId: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.Leverage}
	entitySelector={selector}
	href={href}
	{open}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{selector.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-text="muted">
			{#if Value}
			{@render Value()}
			{/if}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Concentrated-liquidity LP position accounting: owner, tick range, in-range liquidity, uncollected fees, optional ERC-721 token id.
		</p>
		<p>
			Not CEX margin, borrow APR, or liquidation. Requires an on-chain resolver—Dexscreener pool leverages do not supply position-scoped state.
		</p>
		<p>
			No position indexer is wired in this app yet.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={leverage}
			placeholderText="Loading leverage row…"
		>
			{#snippet children(leverage)}
				<dl data-column-item="center">
						<div>
							<dt>Network</dt>
							<dd>
								{#if leverage.fields.$pool !== undefined}
									<EvmNetworkView
										selector={leverage.fields.$pool[EntityMetaKey.Selector].$network}
										layout={EntityLayout.Value}
										open={false}
									/>
								{:else}
									<span data-text="muted">No pool network loaded</span>
								{/if}
							</dd>
						</div>
						<div>
							<dt>Pool</dt>
							<dd>
								{#if leverage.fields.$pool !== undefined}
									<LiquidityPoolView
										selector={leverage.fields.$pool[EntityMetaKey.Selector]}
										layout={EntityLayout.Value}
										open={true}
										showTypeAnnotation={false}
									/>
								{:else}
									<span data-text="muted">No pool loaded</span>
								{/if}
							</dd>
						</div>
						{#if open && leverage.fields.$pool !== undefined && leverage.fields.$owner !== undefined}
							<div>
								<dt>Owner</dt>
								<dd>
									<EvmNetworkAccountView
										selector={{
											$network: leverage.fields.$pool[EntityMetaKey.Selector].$network,
											$actor: leverage.fields.$owner[EntityMetaKey.Selector],
										}}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}

						{#if open && leverage.fields.tickLower !== undefined}
							<div>
								<dt>Tick lower</dt>
								<dd>{String(leverage.fields.tickLower)}</dd>
							</div>
						{/if}

						{#if open && leverage.fields.tickUpper !== undefined}
							<div>
								<dt>Tick upper</dt>
								<dd>{String(leverage.fields.tickUpper)}</dd>
							</div>
						{/if}

						{#if open && leverage.fields.liquidity !== undefined}
							<div>
								<dt>Liquidity</dt>
								<dd>{String(leverage.fields.liquidity)}</dd>
							</div>
						{/if}

						{#if open && leverage.fields.token0Owed !== undefined}
							<div>
								<dt>Token0 owed</dt>
								<dd>{String(leverage.fields.token0Owed)}</dd>
							</div>
						{/if}

						{#if open && leverage.fields.token1Owed !== undefined}
							<div>
								<dt>Token1 owed</dt>
								<dd>{String(leverage.fields.token1Owed)}</dd>
							</div>
						{/if}

						{#if open && leverage.fields.tokenId !== undefined}
							<div>
								<dt>Token id</dt>
								<dd>{String(leverage.fields.tokenId)}</dd>
							</div>
						{/if}

						{#if open && leverage.fields.origin}
							<div>
								<dt>Origin</dt>
								<dd>{leverage.fields.origin}</dd>
							</div>
						{/if}

					{#if leverage.fields.createdAtTimestamp !== undefined}
						<div>
							<dt>Created at</dt>
							<dd>
								<Timestamp
									timestamp={leverage.fields.createdAtTimestamp}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

</EntityView>
