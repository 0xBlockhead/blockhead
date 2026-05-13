<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Address from '$/views/Address.svelte'


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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	const nativeOrErcTitle = (
		entityId.type === CoinInstanceType.NativeCurrency ?
			(
				`Native (${entityId.$network.chainId})`
			)
		:
			(
				`ERC-20 (${entityId.$network.chainId})`
			)
	)


	const coinInstance = useEntity(
		EntityType.CoinInstance,
		entityId,
		{
			$: [
				Source.Coingecko_Rest,
				Source.Constants_Internal,
			],
			decimals: {},
			name: {},
			symbol: {},
			caip19: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.CoinInstance}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary resource={coinInstance}>
			{#snippet children(live)}
				<Heading>
					{#if href}
						<a
							data-link
							{href}
						>{live.symbol ?? live.name ?? nativeOrErcTitle}</a>
					{:else}
						{live.symbol ?? live.name ?? nativeOrErcTitle}
					{/if}
				</Heading>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={coinInstance}>
			{#snippet children(live)}
				<dl>
					<div>
						<dt>Chain</dt>
						<dd>{String(entityId.$network.chainId)}</dd>
					</div>
					<div>
						<dt>Kind</dt>
						<dd>
							{#if entityId.type === CoinInstanceType.NativeCurrency}
								Native
							{:else}
								<Address
									network={entityId.$contract.$network}
									address={entityId.$contract.address}
								/>
							{/if}
						</dd>
					</div>
					{#if open}
						{#if live.name !== undefined}
							<div>
								<dt>Name</dt>
								<dd>{live.name}</dd>
							</div>
						{/if}
						{#if live.symbol !== undefined}
							<div>
								<dt>Symbol</dt>
								<dd>{live.symbol}</dd>
							</div>
						{/if}
						{#if live.decimals !== undefined}
							<div>
								<dt>Decimals</dt>
								<dd>{String(live.decimals)}</dd>
							</div>
						{/if}
						{#if live.caip19 !== undefined}
							<div>
								<dt>CAIP-19</dt>
								<dd>{live.caip19}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.CoinInstance}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
