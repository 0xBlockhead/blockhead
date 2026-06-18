<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.PolkadotPallet>
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
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotPallet}
	entitySelector={selector}
	title={selector.palletName}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{selector.palletName.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.PolkadotPallet,
					selector,
					({ fields: { index: true } }),
				)}
			placeholderText={`Loading Polkadot Pallet...`}
		>
			{#snippet children(polkadotPallet)}
				<dl>
					{#if polkadotPallet.fields.index != null}
						<div>
							<dt>Index</dt>
							<dd><NumberValue value={polkadotPallet.fields.index} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
