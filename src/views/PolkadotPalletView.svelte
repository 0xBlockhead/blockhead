<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
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

	const polkadotPallet = useEntity(entityCollectionsContext, EntityType.PolkadotPallet,
		entityId,
		({ fields: { index: true } }),
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
