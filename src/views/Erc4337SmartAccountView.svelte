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
		title = 'ERC-4337 smart account',
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Erc4337SmartAccount>
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
	const smartAccount = useEntity(
		EntityType.Erc4337SmartAccount,
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
	entityType={EntityType.Erc4337SmartAccount}
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
			placeholderText="Loading smart account…"
			resource={smartAccount}
		>
			{#snippet children(smartAccount)}
				<dl data-column-item="center">
					{#if smartAccount.userOperationsCount !== undefined}
						<div>
							<dt>User operations</dt>
							<dd data-text="mono">{String(smartAccount.userOperationsCount)}</dd>
						</div>
					{/if}
					<div>
						<dt>Account contract</dt>
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
			An ERC-4337 smart account is a contract wallet that signs user operations; it is not a generic linked actor or an explorer “verified contract” catalog row by itself.
		</p>
	{/snippet}
</EntityView>
