<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
		selection,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/upgrade/[upgradeSlug]', {
			caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
				upgradeSlug: selection.entitySelector.upgradeId,
		}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EthereumNetworkUpgrade>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const networkUpgrade = $derived(selection({
			sources: [
				Source.Constants_Internal,
			],
			fields: {
				activationBlock: true,
				activationEpoch: true,
				activationTimestampMs: true,
				$networkExecutionUpgrade: true,
				$networkConsensusUpgrade: true,
			},
		},
	))
	const activationBlock = $derived(networkUpgrade.activationBlock)
	const activationEpoch = $derived(networkUpgrade.activationEpoch)
	const activationTimestampMs = $derived(networkUpgrade.activationTimestampMs)
	const networkExecutionUpgrade = $derived(networkUpgrade.$networkExecutionUpgrade)
	const networkConsensusUpgrade = $derived(networkUpgrade.$networkConsensusUpgrade)



	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EthereumConsensusUpgradeView from '$/views/EthereumConsensusUpgradeView.svelte'
	import EthereumExecutionUpgradeView from '$/views/EthereumExecutionUpgradeView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ProposalsView from '$/views/SpecificationProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.EthereumNetworkUpgrade}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	title={selection.entitySelector.upgradeId}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selection.entitySelector.upgradeId}
		</span>
	{/snippet}

	{#snippet Title()}
		{selection.entitySelector.upgradeId}
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
									<NumberValue value={activationBlock} />
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
										selection={select(EntityType.EthereumExecutionUpgrade, networkExecutionUpgrade.entitySelector)}
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
										selection={select(EntityType.EthereumConsensusUpgrade, networkConsensusUpgrade.entitySelector)}
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
			selection={selection.$$proposals}
			id={`${stringify(selection.entitySelector)}:proposals`}

			title="Specification proposals"
		/>
	{/snippet}
</EntityView>
