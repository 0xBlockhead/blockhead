<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


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
			entityId: EntityId<typeof schema, EntityType.NetworkConsensusUpgrade>
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
	const networkConsensusUpgradeEntityId = $derived(entityId)

	const networkConsensusUpgrade = useEntity(
		EntityType.NetworkConsensusUpgrade,
		networkConsensusUpgradeEntityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			slug: {},
			...(open && {
				protocol: {},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.NetworkConsensusUpgrade}
	{entityId}
	{href}
	bind:open
	title={`Consensus upgrade · ${entityId.upgradeId}`}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.upgradeId}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={networkConsensusUpgrade}
			placeholderText="Loading consensus upgrade…"
		>
			{#snippet children(networkConsensusUpgradeEntity)}
				{networkConsensusUpgradeEntity.name ?? entityId.upgradeId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={networkConsensusUpgrade}
			placeholderText="Loading consensus upgrade…"
		>
			{#snippet children(networkConsensusUpgradeEntity)}
				<dl data-column-item="center">
					<div>
						<dt>Chain ID</dt>
						<dd data-text="mono">
							{String(entityId.$network.chainId)}
						</dd>
					</div>

					{#if open}
						{#if (
							networkConsensusUpgradeEntity.slug !== undefined
							&& networkConsensusUpgradeEntity.slug !== entityId.upgradeId
						)}
							<div>
								<dt>Route slug</dt>
								<dd data-text="mono">
									{networkConsensusUpgradeEntity.slug}
								</dd>
							</div>
						{/if}

						{#if networkConsensusUpgradeEntity.protocol !== undefined}
							<div>
								<dt>Consensus fork</dt>
								<dd>{networkConsensusUpgradeEntity.protocol}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.NetworkConsensusUpgrade}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
