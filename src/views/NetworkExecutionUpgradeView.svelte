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
			entityId: EntityId<typeof schema, EntityType.NetworkExecutionUpgrade>
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
	const networkExecutionUpgradeEntityId = $derived(entityId)

	const networkExecutionUpgrade = useEntity(
		EntityType.NetworkExecutionUpgrade,
		networkExecutionUpgradeEntityId,
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
	entityType={EntityType.NetworkExecutionUpgrade}
	{entityId}
	{href}
	bind:open
	title={`Execution upgrade · ${String(entityId.upgradeId)}`}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.upgradeId}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={networkExecutionUpgrade}
			placeholderText="Loading execution upgrade…"
		>
			{#snippet children(networkExecutionUpgradeEntity)}
				{networkExecutionUpgradeEntity.name ?? entityId.upgradeId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={networkExecutionUpgrade}
			placeholderText="Loading execution upgrade…"
		>
			{#snippet children(networkExecutionUpgradeEntity)}
				<dl data-column-item="center">
					<div>
						<dt>Chain ID</dt>
						<dd data-text="mono">
							{String(entityId.$network.chainId)}
						</dd>
					</div>

					{#if open}
						{#if (
							networkExecutionUpgradeEntity.slug !== undefined
							&& networkExecutionUpgradeEntity.slug !== entityId.upgradeId
						)}
							<div>
								<dt>Route slug</dt>
								<dd data-text="mono">
									{networkExecutionUpgradeEntity.slug}
								</dd>
							</div>
						{/if}

						{#if networkExecutionUpgradeEntity.protocol !== undefined}
							<div>
								<dt>Execution fork</dt>
								<dd>{networkExecutionUpgradeEntity.protocol}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.NetworkExecutionUpgrade}
			{entityId}
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
