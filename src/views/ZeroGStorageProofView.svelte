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
			entityId: EntityId<typeof schema, EntityType.ZeroGStorageProof>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const zeroGStorageProof = useEntity(entityCollectionsContext, EntityType.ZeroGStorageProof,
		entityId,
		({ fields: { proofKind: true, verifiedAtBlock: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGStorageProof}
	{entityId}
	title={entityId.proofId}
	idDragPlainText={entityId.proofId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<TruncatedValue
			value={entityId.proofId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Storage proof </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={zeroGStorageProof}
			placeholderText={`Loading 0G storage proof...`}
		>
			{#snippet children(zeroGStorageProof)}
				<dl>
					{#if zeroGStorageProof.fields.proofKind != null}
						<div>
							<dt>Proof Kind</dt>
							<dd>
								<TruncatedValue
									value={zeroGStorageProof.fields.proofKind}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if zeroGStorageProof.fields.verifiedAtBlock != null}
						<div>
							<dt>Verified At Block</dt>
							<dd><NumberValue value={zeroGStorageProof.fields.verifiedAtBlock} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
