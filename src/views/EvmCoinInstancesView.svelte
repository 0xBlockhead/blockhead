<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmCoinInstance> = $props()


	// Components
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmCoinInstance}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: evmCoinInstance })}
		{@const evmCoinInstanceSelector = evmCoinInstance[EntityMetaKey.Selector]}
		{@const evmCoinInstanceHref = (
			'caip2' in evmCoinInstanceSelector.$network
			&& (evmCoinInstanceSelector.type === 'NativeCurrency'
			|| (evmCoinInstanceSelector.type === 'Erc20Token'
			&& '$contract' in evmCoinInstanceSelector)) ?
				resolve(
					'/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]',
					{
						chainId: String(evmCoinInstanceSelector.$network.caip2.reference),
						coinInstanceSlug: (
							evmCoinInstanceSelector.type === 'NativeCurrency' ?
								'native'
							:
								String(evmCoinInstanceSelector.$contract.address)
						),
					}
				)
			:
				undefined
		)}
		{@const selection = select(EntityType.EvmCoinInstance, evmCoinInstanceSelector)}
		<ProjectionBoundary
			resource={selection.NativeCurrency}
		>
			{#snippet Applicable(evmCoinInstanceProjection0)}
				<ResourceBoundary
					resource={evmCoinInstanceProjection0.symbol}
				>
					{#snippet children(nativeCurrencySymbol0)}
						<ResourceBoundary
							resource={evmCoinInstanceProjection0.name}
						>
							{#snippet children(nativeCurrencyName1)}
								<EntityView
									entityType={EntityType.EvmCoinInstance}
									entitySelector={evmCoinInstanceSelector}
									href={evmCoinInstanceHref}
								>
									{#snippet Title()}
										{[String(nativeCurrencySymbol0 ?? ''), String(nativeCurrencyName1 ?? '')].filter(Boolean).join(' ') || 'EVM coin instance'}
									{/snippet}
								</EntityView>
							{/snippet}
						</ResourceBoundary>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Erc20Token}
		>
			{#snippet Applicable(evmCoinInstanceProjection1)}
				<ResourceBoundary
					resource={evmCoinInstanceProjection1.symbol}
				>
					{#snippet children(erc20TokenSymbol0)}
						<ResourceBoundary
							resource={evmCoinInstanceProjection1.name}
						>
							{#snippet children(erc20TokenName1)}
								<EntityView
									entityType={EntityType.EvmCoinInstance}
									entitySelector={evmCoinInstanceSelector}
									href={evmCoinInstanceHref}
								>
									{#snippet Title()}
										{[String(erc20TokenSymbol0 ?? ''), String(erc20TokenName1 ?? '')].filter(Boolean).join(' ') || 'EVM coin instance'}
									{/snippet}
								</EntityView>
							{/snippet}
						</ResourceBoundary>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntitiesList>
