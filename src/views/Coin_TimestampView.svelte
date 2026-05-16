<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import CoinView from '$/views/CoinView.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary, { Layout } from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'


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
			entityId: EntityId<typeof schema, EntityType.Coin_Timestamp>
			href?: string
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


	// State
	import { stringify } from 'devalue'
	import { useEntity } from '$/collections/$queries.svelte.ts'


	const coinTimestamp = useEntity(
		EntityType.Coin_Timestamp,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			marketCap: {},
			totalSupply: {},
		},
	)


	const resolvedHref = (
		href
		?? resolve(
			'/(assets)/(coins)/coin/[coinId]',
			{
				coinId: entityId.$coin.coinId,
			},
		)
	)


	const timestampMs = (
		Number(entityId.timestampNs / 1_000_000n)
	)
</script>


<EntityView
	entityType={EntityType.Coin_Timestamp}
	{entityId}
	href={resolvedHref}
	{open}
	title={`${entityId.$coin.coinId} snapshot`}
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-text="font-monospace">
			{entityId.coinId}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={coinTimestamp}>
			{#snippet children(live)}
				<dl>
					{#if live.marketCap !== undefined}
						<div>
							<dt>Market cap</dt>
							<dd>{String(live.marketCap)}</dd>
						</div>
					{/if}
					<div>
						<dt>As of</dt>
						<dd>
							<Timestamp
								timestamp={timestampMs}
								format={TimestampFormat.Both}
							/>
						</dd>
					</div>
					{#if open}
						{#if live.totalSupply !== undefined}
							<div>
								<dt>Total supply</dt>
								<dd>{String(live.totalSupply)}</dd>
							</div>
						{/if}
						<div>
							<dt>Timestamp (ns)</dt>
							<dd>{String(entityId.timestampNs)}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Coin_Timestamp}
			{entityId}
		/>

		<section>
			<h2>
				Coin
			</h2>
			<ResourceBoundary
				layout={Layout.Block}
				resource={coinTimestamp}
			>
				{#snippet children()}
					<CoinView
						entityId={entityId.$coin}
						href={resolve(
							'/(assets)/(coins)/coin/[coinId]',
							{
								coinId: entityId.$coin.coinId,
							},
						)}
						id={`${stringify(entityId)}:coin`}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		</section>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
