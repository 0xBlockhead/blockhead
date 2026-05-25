<script lang="ts">
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


	// Props
	let {
		entityId,
		href = resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(upgrades)/upgrade/[upgradeSlug]',
			{
				networkId: String(entityId.$network.chainId),
				upgradeSlug: entityId.upgradeId,
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NetworkUpgrade>
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
		EntityType.NetworkUpgrade,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			activationBlock: {},
			activationEpoch: {},
			activationTimestamp: {},
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
	import NetworkConsensusUpgradeView from '$/views/NetworkConsensusUpgradeView.svelte'
	import NetworkExecutionUpgradeView from '$/views/NetworkExecutionUpgradeView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ProposalsView from '$/views/ProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.NetworkUpgrade}
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

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={networkUpgrade}
			placeholderText="Loading network upgrade…"
		>
			{#snippet children(loadedNetworkUpgrade)}
				<dl data-column-item="center">
					{#if loadedNetworkUpgrade.activationBlock !== undefined}
						<div>
							<dt>Activation block</dt>
							<dd>
								<EvmBlockView
									entityId={{
										$network: { chainId: entityId.$network.chainId },
										blockNumber: loadedNetworkUpgrade.activationBlock,
									}}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if loadedNetworkUpgrade.activationEpoch !== undefined}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								<NumberValue value={loadedNetworkUpgrade.activationEpoch} />
							</dd>
						</div>
					{/if}

					{#if loadedNetworkUpgrade.activationTimestamp !== undefined}
						<div>
							<dt>Activation time</dt>
							<dd>
								<Timestamp
									timestamp={(
										loadedNetworkUpgrade.activationTimestamp < 1e12 ?
											loadedNetworkUpgrade.activationTimestamp * 1000
										:
											loadedNetworkUpgrade.activationTimestamp
									)}
								/>
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Execution layer</dt>
							<dd>
								<NetworkExecutionUpgradeView
									entityId={loadedNetworkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id]}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>

						{#if loadedNetworkUpgrade.$networkConsensusUpgrade}
							<div>
								<dt>Consensus layer</dt>
								<dd>
									<NetworkConsensusUpgradeView
										entityId={loadedNetworkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id]}
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
		<EntityDetails
			entityType={EntityType.NetworkUpgrade}
			{entityId}
		/>
		<ProposalsView
			href={resolve('/proposals')}
			entityFieldReference={{
				entityType: EntityType.NetworkUpgrade,
				entityId,
				fieldName: '$$proposals',
			}}
			id={`${stringify(entityId)}:proposals`}
			open={false}
			title="Specification proposals"
		/>
	{/snippet}
</EntityView>

