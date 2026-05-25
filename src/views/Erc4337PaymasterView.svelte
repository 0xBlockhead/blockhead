<script lang="ts">
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
			'/(explore)/(networks)/network/[networkId]/(network)/erc-4337/paymaster/[address]',
			{
				networkId: String(entityId.$network.chainId),
				address: entityId.address,
			},
		),
		layout = EntityLayout.Summary,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		title = 'ERC-4337 paymaster',
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Erc4337Paymaster>
			href?: string
			layout?: EntityLayout
			open?: boolean
			title?: string
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const paymaster = useEntity(
		EntityType.Erc4337Paymaster,
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
	entityType={EntityType.Erc4337Paymaster}
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
			placeholderText="Loading paymaster…"
			resource={paymaster}
		>
			{#snippet children(loadedPaymaster)}
				<dl data-column-item="center">
					{#if loadedPaymaster.userOperationsCount !== undefined}
						<div>
							<dt>User operations</dt>
							<dd data-text="mono">{String(paymaster.userOperationsCount)}</dd>
						</div>
					{/if}
					<div>
						<dt>Paymaster contract</dt>
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
			A paymaster is an ERC-4337 contract that sponsors or refunds gas for user operations; it is not a smart-account wallet or a bundler operator.
		</p>
	{/snippet}
</EntityView>
