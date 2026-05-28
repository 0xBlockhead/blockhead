<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromEvmChainId } from '$/lib/caip.ts'


	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/erc-4337/account-factory/[address]',
			{
				...caip2RouteParamsFromEvmChainId(entityId.$network.chainId),
				address: entityId.address,
			},
		),
		layout = EntityLayout.Summary,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		title = 'ERC-4337 account factory',
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Erc4337AccountFactory>
			href?: string
			layout?: EntityLayout
			open?: boolean
			title?: string
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const accountFactory = useEntity(
		EntityType.Erc4337AccountFactory,
		entityId,
		{
			$: [
				Source.Blockscout_Rest,
			],
			userOperationsCount: {},
		},
	)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4337AccountFactory}
	{entityId}
	href={href}
	{layout}
	bind:open
	{title}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			value={entityId.address}
		/>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			value={entityId.address}
		/>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			placeholderText="Loading account factory…"
			resource={accountFactory}
		>
			{#snippet children(accountFactory)}
				<dl data-column-item="center">
					{#if accountFactory.userOperationsCount !== undefined}
						<div>
							<dt>User operations</dt>
							<dd data-text="mono">{String(accountFactory.userOperationsCount)}</dd>
						</div>
					{/if}
					<div>
						<dt>Factory contract</dt>
						<dd>
							<EvmContractView
								entityId={{
									$network: entityId.$network,
									address: entityId.address,
								}}
								layout={EntityLayout.SummaryDetails}
								open={true}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			An account factory deploys ERC-4337 smart-account implementations; it is indexed separately from individual smart accounts and paymasters.
		</p>
	{/snippet}
</EntityView>
