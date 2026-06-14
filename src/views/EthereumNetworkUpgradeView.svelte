<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(upgrades)/upgrade/[upgradeSlug]', {
			caip2Namespace: selector.$network.caip2.namespace,
			caip2Reference: selector.$network.caip2.reference,
				upgradeSlug: selector.upgradeId,
		}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EthereumNetworkUpgrade>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const networkUpgrade = subscribe(EntityType.EthereumNetworkUpgrade,
		selector,
		({ sources: [
				Source.Constants_Internal,
			], fields: { name: true, activationBlock: true, activationEpoch: true, activationTimestampMs: true, $networkExecutionUpgrade: true, ...(open ? ({ $networkConsensusUpgrade: true }) : ({  })) } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EthereumConsensusUpgradeView from '$/views/EthereumConsensusUpgradeView.svelte'
	import EthereumExecutionUpgradeView from '$/views/EthereumExecutionUpgradeView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ProposalsView from '$/views/SpecificationProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumNetworkUpgrade}
	entitySelector={selector}
	href={href}
	bind:open
	title={selector.upgradeId}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.upgradeId}
		</span>
	{/snippet}

	{#snippet Title()}
		{(
			networkUpgrade.ready ?
				(networkUpgrade.current?.fields.name ?? selector.upgradeId)
			:
				selector.upgradeId
		)}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Marketing or catalog label for a coordinated network fork: always links an execution-layer upgrade and, when both layers shipped together, a consensus-layer upgrade.
		</p>
		<p>
			Activation timing and EIP/ERC specification proposals are taken from the linked execution-layer fork when that row lists them; otherwise from the consensus fork ethereumNetworkUpgrade.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={networkUpgrade}
			placeholderText="Loading network upgrade…"
		>
			{#snippet children(networkUpgrade)}
				<dl data-column-item="center">
					{#if contentOpen && networkUpgrade.fields.activationBlock !== undefined}
						<div>
							<dt>Activation block</dt>
							<dd>
									<EvmBlockView
										selector={{
											$network: selector.$network,
											blockNumber: BigInt(networkUpgrade.fields.activationBlock),
										}}
										layout={EntityLayout.Value}
										open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if networkUpgrade.fields.activationEpoch !== undefined}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								<NumberValue value={networkUpgrade.fields.activationEpoch} />
							</dd>
						</div>
					{/if}

					{#if networkUpgrade.fields.activationTimestampMs !== undefined}
						<div>
							<dt>Activation time</dt>
							<dd>
								<Timestamp
									timestamp={networkUpgrade.fields.activationTimestampMs}
								/>
							</dd>
						</div>
					{/if}

						{#if open && networkUpgrade.fields.$networkExecutionUpgrade}
							<div>
								<dt>Execution layer</dt>
								<dd>
								<EthereumExecutionUpgradeView
									selector={networkUpgrade.fields.$networkExecutionUpgrade[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if open}
							{#if networkUpgrade.fields.$networkConsensusUpgrade}
								<div>
								<dt>Consensus layer</dt>
								<dd>
									<EthereumConsensusUpgradeView
										selector={networkUpgrade.fields.$networkConsensusUpgrade[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open })}
		<ProposalsView
			href={resolve('/proposals')}
			entityFieldReference={{
				entityType: EntityType.EthereumNetworkUpgrade,
				selector,
				fieldName: '$$proposals',
			}}
			id={`${stringify(selector)}:proposals`}
			open={false}
			title="Specification proposals"
		/>
	{/snippet}
</EntityView>
