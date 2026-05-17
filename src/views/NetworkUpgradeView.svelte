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

	const networkUpgrade = useEntity(
		EntityType.NetworkUpgrade,
		networkUpgradeEntityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			activationBlock: {},
			activationEpoch: {},
			activationTimestamp: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
</script>


<EntityView
	{...entityViewRest}
	entityType={EntityType.NetworkUpgrade}
	{entityId}
	{href}
	{open}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.upgradeSlug}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={networkUpgrade}
			placeholderText="Loading network upgrade…"
		>
			{#snippet children(networkUpgradeEntity)}
				{networkUpgradeEntity.name ?? entityId.upgradeId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={networkUpgrade}
			placeholderText="Loading network upgrade…"
		>
			{#snippet children(networkUpgradeEntity)}
				<dl>
					{#if open}
						{#if networkUpgradeEntity.activationBlock !== undefined}
							<div>
								<dt>Activation block</dt>
								<dd>{String(networkUpgradeEntity.activationBlock)}</dd>
							</div>
						{/if}
						{#if networkUpgradeEntity.activationEpoch !== undefined}
							<div>
								<dt>Activation epoch</dt>
								<dd>{String(networkUpgradeEntity.activationEpoch)}</dd>
							</div>
						{/if}
						{#if networkUpgradeEntity.activationTimestamp !== undefined}
							<div>
								<dt>Activation time</dt>
								<dd>
									<Timestamp
										timestamp={networkUpgradeEntity.activationTimestamp}
										format={TimestampFormat.Absolute}
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

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
