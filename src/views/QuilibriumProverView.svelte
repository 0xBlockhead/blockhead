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
			entityId: EntityId<typeof schema, EntityType.QuilibriumProver>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const quilibriumProver = useEntity(entityCollectionsContext, EntityType.QuilibriumProver,
		entityId,
		({ fields: { publicKey: true, version: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.QuilibriumProver}
	{entityId}
	title={entityId.proverPeerId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.proverPeerId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={quilibriumProver}
			placeholderText={`Loading Quilibrium Prover...`}
		>
			{#snippet children(quilibriumProver)}
				<dl>
					{#if quilibriumProver.fields.publicKey != null}
						<div>
							<dt>Public Key</dt>
							<dd>
								<TruncatedValue
									value={quilibriumProver.fields.publicKey}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if quilibriumProver.fields.version != null}
						<div>
							<dt>Version</dt>
							<dd>{quilibriumProver.fields.version}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
