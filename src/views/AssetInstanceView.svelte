<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.AssetInstance>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const asset = $derived(select(EntityType.AssetInstance, selector, ({ sources: [
				Source.Constants_Internal,
			], fields: { name: true, symbol: true, coinId: true, decimals: true } })))


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.AssetInstance}
	entitySelector={selector}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<ResourceBoundary resource={asset}>
			{#snippet children(asset)}
				{asset.fields.symbol}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={asset}>
			{#snippet children(asset)}
				{asset.fields.name}
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
						<dd>{asset.fields.symbol}</dd>
					</div>

					<div>
						<dt>Name</dt>
						<dd>{asset.fields.name}</dd>
					</div>

					{#if asset.fields.decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd>{asset.fields.decimals}</dd>
						</div>
					{/if}

					<div>
						<dt>Kind</dt>
						<dd>{selector.kind}</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
