<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const quilibriumProver = useEntity(
		EntityType.QuilibriumProver,
		entityId,
		{
			publicKey: {},
			version: {},
		},
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

	{#snippet Heading()}
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
					{#if quilibriumProver.publicKey != null}
						<div>
							<dt>Public Key</dt>
							<dd>
								<TruncatedValue
									value={quilibriumProver.publicKey}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if quilibriumProver.version != null}
						<div>
							<dt>Version</dt>
							<dd>{quilibriumProver.version}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
