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
		children,
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.NetworkUpgrade>
			href?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Content'
			| 'Details'
			| 'Heading'
			| 'Title'
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
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import NetworkConsensusUpgradeView from '$/views/NetworkConsensusUpgradeView.svelte'
	import NetworkExecutionUpgradeView from '$/views/NetworkExecutionUpgradeView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ProposalsView from '$/views/ProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.NetworkUpgrade}
	{entityId}
	{href}
	bind:open
	title={`Network upgrade · ${entityId.upgradeId}`}
	{...entityViewRest}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Marketing or catalog label for a coordinated network fork: always links an execution-layer upgrade and, when both layers shipped together, a consensus-layer upgrade.
		</p>
		<p>
			Activation timing and EIP/ERC specification proposals are taken from the linked execution-layer fork when that row lists them; otherwise from the consensus fork row.
		</p>
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
			placeholderText=""
		>
			{#snippet children(networkUpgrade)}
				<dl data-column-item="center">
					{#if networkUpgrade.activationBlock !== undefined}
						<div>
							<dt>Activation block</dt>
							<dd>
								<EvmBlockView
									entityId={{
										$network: { chainId: entityId.$network.chainId },
										blockNumber: networkUpgrade.activationBlock,
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
										{
											networkId: String(entityId.$network.chainId),
											blockNumber: String(networkUpgrade.activationBlock),
										},
									)}
									layout={EntityLayout.Title}
									open={false}
									showTypeAnnotation={false}
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

					{#if networkUpgrade.activationTimestamp !== undefined}
						<div>
							<dt>Activation time</dt>
							<dd>
								<Timestamp
									timestamp={(
										networkUpgrade.activationTimestamp < 1e12 ?
											networkUpgrade.activationTimestamp * 1000
										:
											networkUpgrade.activationTimestamp
									)}
									format={TimestampFormat.Both}
								/>
							</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Execution layer</dt>
							<dd>
								<NetworkExecutionUpgradeView
									entityId={networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id]}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(upgrades)/upgrade/[upgradeSlug]',
										{
											networkId: String(entityId.$network.chainId),
											upgradeSlug: (
												networkUpgrade.$networkExecutionUpgrade.slug
												?? networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId
											),
										},
									)}
									layout={EntityLayout.Summary}
									open={false}
									showTypeAnnotation={false}
								/>
							</dd>
						</div>

						{#if networkUpgrade.$networkConsensusUpgrade}
							<div>
								<dt>Consensus layer</dt>
								<dd>
									<NetworkConsensusUpgradeView
										entityId={networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id]}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(upgrades)/upgrade/[upgradeSlug]',
											{
												networkId: String(entityId.$network.chainId),
												upgradeSlug: (
													networkUpgrade.$networkConsensusUpgrade.slug
													?? networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId
												),
											},
										)}
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

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.NetworkUpgrade}
			{entityId}
		/>

		<ProposalsView
			entityFieldReference={{
				entityType: EntityType.NetworkUpgrade,
				entityId,
				fieldName: '$$proposals',
			}}
			id={`${stringify(entityId)}:proposals`}
			open={false}
			title="Specification proposals"
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
