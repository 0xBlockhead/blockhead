<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/upgrade/[upgradeSlug]', {
			caip2: `${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`,
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

	const networkUpgrade = $derived(select(
		EntityType.EthereumNetworkUpgrade,
		selector,
		{
			sources: [
				Source.Constants_Internal,
			],
		},
	))
	const name = $derived(networkUpgrade.name)
	const activationBlock = $derived(networkUpgrade.activationBlock)
	const activationEpoch = $derived(networkUpgrade.activationEpoch)
	const activationTimestampMs = $derived(networkUpgrade.activationTimestampMs)
	const networkExecutionUpgrade = $derived(networkUpgrade.$networkExecutionUpgrade)
	const networkConsensusUpgrade = $derived(networkUpgrade.$networkConsensusUpgrade)



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
		<ResourceBoundary
			resource={name}
			placeholderText="Loading network upgrade…"
		>
			{#snippet children(name)}
				{name ?? selector.upgradeId}
			{/snippet}
		</ResourceBoundary>
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
		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={activationBlock}
					placeholderText="Loading activation block…"
				>
					{#snippet children(activationBlock)}
						{#if activationBlock !== undefined}
							<div>
								<dt>Activation block</dt>
								<dd>
									<EvmBlockView
										selector={{
											$network: selector.$network,
											blockNumber: BigInt(activationBlock),
										}}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			<ResourceBoundary
				resource={activationEpoch}
				placeholderText="Loading activation epoch…"
			>
				{#snippet children(activationEpoch)}
					{#if activationEpoch !== undefined}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								<NumberValue value={activationEpoch} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={activationTimestampMs}
				placeholderText="Loading activation time…"
			>
				{#snippet children(activationTimestampMs)}
					{#if activationTimestampMs !== undefined}
						<div>
							<dt>Activation time</dt>
							<dd>
								<Timestamp
									timestamp={activationTimestampMs}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if open}
				<ResourceBoundary
					resource={networkExecutionUpgrade}
					placeholderText="Loading execution upgrade…"
				>
					{#snippet children(networkExecutionUpgrade)}
						{#if networkExecutionUpgrade !== undefined}
							<div>
								<dt>Execution layer</dt>
								<dd>
									<EthereumExecutionUpgradeView
										selector={networkExecutionUpgrade.entitySelector}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={networkConsensusUpgrade}
					placeholderText="Loading consensus upgrade…"
				>
					{#snippet children(networkConsensusUpgrade)}
						{#if networkConsensusUpgrade !== undefined}
							<div>
								<dt>Consensus layer</dt>
								<dd>
									<EthereumConsensusUpgradeView
										selector={networkConsensusUpgrade.entitySelector}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open })}
		<ProposalsView
			href={resolve('/proposals')}
			selection={select(
				EntityType.EthereumNetworkUpgrade,
				selector
			).$$proposals}
			id={`${stringify(selector)}:proposals`}

			title="Specification proposals"
		/>
	{/snippet}
</EntityView>
