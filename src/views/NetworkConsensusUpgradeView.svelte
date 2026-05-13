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
			protocol: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	{...entityViewRest}
	entityType={EntityType.NetworkConsensusUpgrade}
	{entityId}
	{href}
	{open}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={networkConsensusUpgrade}
			placeholderText="Loading network consensus upgrade…"
		>
			{#snippet children(networkConsensusUpgradeEntity)}
				<HeadingComponent>{networkConsensusUpgradeEntity.name ?? entityId.upgradeId}</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={networkConsensusUpgrade}
			placeholderText="Loading network consensus upgrade…"
		>
			{#snippet children(networkConsensusUpgradeEntity)}
				<dl>
					<div>
						<dt>Upgrade</dt>
						<dd>{entityId.upgradeId}</dd>
					</div>
					{#if open}
						{#if networkConsensusUpgradeEntity.protocol !== undefined}
							<div>
								<dt>Protocol</dt>
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
