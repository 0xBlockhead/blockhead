<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { stringify } from 'devalue'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
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
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	const networkUpgradeEntityId = $derived(entityId)

	const networkUpgradeKey = $derived(
		stringify(entityId),
	)

	const networkUpgrade = useEntity(
		EntityType.NetworkUpgrade,
		networkUpgradeEntityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			slug: {},
			activationBlock: {},
			activationEpoch: {},
			activationTimestamp: {},
			$networkExecutionUpgrade: {},
			$networkConsensusUpgrade: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import NetworkConsensusUpgradeView from '$/views/NetworkConsensusUpgradeView.svelte'
	import NetworkExecutionUpgradeView from '$/views/NetworkExecutionUpgradeView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.NetworkUpgrade}
	{entityId}
	{href}
	bind:open
	title={`Network upgrade · ${entityId.upgradeId}`}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.upgradeId}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={networkUpgrade}
			placeholderText="Loading upgrade…"
		>
			{#snippet children(networkUpgradeEntity)}
				{networkUpgradeEntity.name ?? entityId.upgradeId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={networkUpgrade}
			placeholderText="Loading upgrade…"
		>
			{#snippet children(networkUpgradeEntity)}
				<dl data-column-item="center">
					<div>
						<dt>Chain ID</dt>
						<dd data-text="mono">
							{String(entityId.$network.chainId)}
						</dd>
					</div>

					{#if open}
						{#if (
							networkUpgradeEntity.slug !== undefined
							&& networkUpgradeEntity.slug !== entityId.upgradeId
						)}
							<div>
								<dt>Route slug</dt>
								<dd data-text="mono">
									{networkUpgradeEntity.slug}
								</dd>
							</div>
						{/if}

						{#if networkUpgradeEntity.activationBlock !== undefined}
							<div>
								<dt>Activation block</dt>
								<dd>
									<NumberValue value={networkUpgradeEntity.activationBlock} />
								</dd>
							</div>
						{/if}

						{#if networkUpgradeEntity.activationEpoch !== undefined}
							<div>
								<dt>Activation epoch</dt>
								<dd>
									<NumberValue value={networkUpgradeEntity.activationEpoch} />
								</dd>
							</div>
						{/if}

						{#if networkUpgradeEntity.activationTimestamp !== undefined}
							<div>
								<dt>Activation time</dt>
								<dd>
									<Timestamp
										timestamp={(
											networkUpgradeEntity.activationTimestamp < 1e12 ?
												networkUpgradeEntity.activationTimestamp * 1000
											:
												networkUpgradeEntity.activationTimestamp
										)}
										format={TimestampFormat.Both}
									/>
								</dd>
							</div>
						{/if}
					{/if}
				</dl>

				<div data-column>
					<section id={`${networkUpgradeKey}:execution-upgrade`}>
						<NetworkExecutionUpgradeView
							entityId={networkUpgradeEntity.$networkExecutionUpgrade[EntityMetaKey.Id]}
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(upgrades)/upgrade/[upgradeSlug]',
								{
									networkId: String(entityId.$network.chainId),
									upgradeSlug: (
										networkUpgradeEntity.$networkExecutionUpgrade.slug
										?? networkUpgradeEntity.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId
									),
								},
							)}
							layout={EntityLayout.Summary}
							open={true}
						/>
					</section>

					<section id={`${networkUpgradeKey}:consensus-upgrade`}>
						{#if networkUpgradeEntity.$networkConsensusUpgrade}
							<NetworkConsensusUpgradeView
								entityId={networkUpgradeEntity.$networkConsensusUpgrade[EntityMetaKey.Id]}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(upgrades)/upgrade/[upgradeSlug]',
									{
										networkId: String(entityId.$network.chainId),
										upgradeSlug: (
											networkUpgradeEntity.$networkConsensusUpgrade.slug
											?? networkUpgradeEntity.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId
										),
									},
								)}
								layout={EntityLayout.Summary}
								open={true}
							/>
						{:else}
							<p data-text="muted">
								No linked consensus fork for this upgrade on this network.
							</p>
						{/if}
					</section>
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.NetworkUpgrade}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
