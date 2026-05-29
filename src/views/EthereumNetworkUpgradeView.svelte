<script lang="ts">
	// Types/constants
	import {
		caip2RouteParamsFromNetworkId,
		evmChainIdFromNetworkId,
	} from '$/lib/caip.ts'


	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(upgrades)/upgrade/[upgradeSlug]',
			{
				...caip2RouteParamsFromNetworkId(entityId.$network),
				upgradeSlug: entityId.upgradeId,
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EthereumNetworkUpgrade>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const networkUpgrade = useEntity(
		EntityType.EthereumNetworkUpgrade,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			activationBlock: {},
			activationEpoch: {},
			activationTimestampMs: {},
			$networkExecutionUpgrade: {},
			...(open ?
				{
					$networkConsensusUpgrade: {},
				}
			:
				{}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
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
	{entityId}
	href={href}
	bind:open
	title={entityId.upgradeId}
	{...EntityViewProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Marketing or catalog label for a coordinated network fork: always links an execution-layer upgrade and, when both layers shipped together, a consensus-layer upgrade.
		</p>
		<p>
			Activation timing and EIP/ERC specification proposals are taken from the linked execution-layer fork when that row lists them; otherwise from the consensus fork row.
		</p>
	{/snippet}

	{#snippet Value()}
		<span>
			{entityId.upgradeId}
		</span>
	{/snippet}

	{#snippet Title()}
		<span>
			{entityId.upgradeId}
		</span>
	{/snippet}

	{#snippet Heading()}
		{(
			networkUpgrade.ready ?
				(networkUpgrade.current.name ?? entityId.upgradeId)
			:
				entityId.upgradeId
		)}
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
					{#if contentOpen && networkUpgrade.activationBlock !== undefined}
						<div>
							<dt>Activation block</dt>
							<dd>
								<EvmBlockView
									entityId={{
										$network: networkIdFromEvmChainId(evmChainIdFromNetworkId(entityId.$network)),
										blockNumber: networkUpgrade.activationBlock,
									}}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if networkUpgrade.activationEpoch !== undefined}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								<NumberValue value={networkUpgrade.activationEpoch} />
							</dd>
						</div>
					{/if}

					{#if networkUpgrade.activationTimestampMs !== undefined}
						<div>
							<dt>Activation time</dt>
							<dd>
								<Timestamp
									timestamp={networkUpgrade.activationTimestampMs}
								/>
							</dd>
						</div>
					{/if}

						{#if open && networkUpgrade.$networkExecutionUpgrade}
							<div>
								<dt>Execution layer</dt>
								<dd>
								<EthereumExecutionUpgradeView
									entityId={networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id]}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}

						{#if open}
							{#if networkUpgrade.$networkConsensusUpgrade}
								<div>
								<dt>Consensus layer</dt>
								<dd>
									<EthereumConsensusUpgradeView
										entityId={networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id]}
										layout={EntityLayout.Summary}
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

	{#snippet Details({ open: _detailsOpen })}
		<ProposalsView
			href={resolve('/proposals')}
			entityFieldReference={{
				entityType: EntityType.EthereumNetworkUpgrade,
				entityId,
				fieldName: '$$proposals',
			}}
			id={`${stringify(entityId)}:proposals`}
			open={false}
			title="Specification proposals"
		/>
	{/snippet}
</EntityView>
