<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.AssetInstance>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const asset = useEntity(
		EntityType.AssetInstance,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			symbol: {},
			coinId: {},
			decimals: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.AssetInstance}
	{entityId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<ResourceBoundary resource={asset}>
			{#snippet children(asset)}
				{asset.symbol}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={asset}>
			{#snippet children(asset)}
				{asset.name}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={asset}
			placeholderText="Loading asset…"
		>
			{#snippet children(asset)}
				<dl>
					<div>
						<dt>Symbol</dt>
						<dd>{asset.symbol}</dd>
					</div>

					<div>
						<dt>Name</dt>
						<dd>{asset.name}</dd>
					</div>

					{#if asset.decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd>{asset.decimals}</dd>
						</div>
					{/if}

					<div>
						<dt>Kind</dt>
						<dd>{entityId.kind}</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
