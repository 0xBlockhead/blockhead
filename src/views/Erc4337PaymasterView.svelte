<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import { resolve } from '$app/paths'

	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Components
	import EvmContractView from '$/views/EvmContractView.svelte'


	// Props
	let {
		entityId,
		href,
		layout = EntityLayout.Summary,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		title = 'ERC-4337 paymaster',
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Erc4337Paymaster>
			href: string
			layout?: EntityLayout
			open?: boolean
			title?: string
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
		>
	> = $props()


	// State
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
</script>


<EntityView
	entityType={EntityType.Erc4337Paymaster}
	{entityId}
	{href}
	{layout}
	bind:open
	{title}
	{...entityViewRest}
>
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
			{#snippet children(paymaster)}
				<dl data-column-item="center">
					{#if paymaster.userOperationsCount !== undefined}
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
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
									{
										networkId: String(entityId.$network.chainId),
										address: entityId.address,
									},
								)}
								layout={EntityLayout.Title}
								open={false}
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
