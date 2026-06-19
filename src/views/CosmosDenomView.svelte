<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.CosmosDenom>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosDenom}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.denom}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{selection.entitySelector.denom.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ fields: { display: true, base: true, symbol: true } }),
				)}
			placeholderText={`Loading Cosmos Denom...`}
		>
			{#snippet children(cosmosDenom)}
				<dl>
					{#if cosmosDenom.fields.display != null}
						<div>
							<dt>Display</dt>
							<dd>{cosmosDenom.fields.display}</dd>
						</div>
					{/if}

					{#if cosmosDenom.fields.base != null}
						<div>
							<dt>Base</dt>
							<dd>{cosmosDenom.fields.base}</dd>
						</div>
					{/if}

					{#if cosmosDenom.fields.symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>{cosmosDenom.fields.symbol}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
