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
			entityId: EntityId<typeof schema, EntityType.LitecoinMwebTransaction>
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

	const litecoinMwebTransaction = useEntity(
		EntityType.LitecoinMwebTransaction,
		entityId,
		{
			kernelOffset: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebTransaction}
	{entityId}
	title={`Litecoin MWEB Transaction ${entityId.transactionIndex.toString()}`}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{entityId.transactionIndex.toString()}
	{/snippet}

	{#snippet Heading()}
		{entityId.transactionIndex.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={litecoinMwebTransaction}
			placeholderText={`Loading Litecoin MWEB Transaction...`}
		>
			{#snippet children(litecoinMwebTransaction)}
				<dl>
					{#if litecoinMwebTransaction.kernelOffset != null}
						<div>
							<dt>Kernel Offset</dt>
							<dd>{litecoinMwebTransaction.kernelOffset}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
