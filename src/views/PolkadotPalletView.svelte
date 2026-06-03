<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.PolkadotPallet>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const polkadotPallet = useEntity(
		EntityType.PolkadotPallet,
		entityId,
		{
			index: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotPallet}
	{entityId}
	title={entityId.palletName}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{entityId.palletName.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={polkadotPallet}
			placeholderText={`Loading Polkadot Pallet...`}
		>
			{#snippet children(polkadotPallet)}
				<dl>
					{#if polkadotPallet.index != null}
						<div>
							<dt>Index</dt>
							<dd><NumberValue value={polkadotPallet.index} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
