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
			entityId: EntityId<typeof schema, EntityType.LitecoinMwebPegIn>
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

	const litecoinMwebPegIn = useEntity(
		EntityType.LitecoinMwebPegIn,
		entityId,
		{
			amountLitoshis: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebPegIn}
	{entityId}
	title={`Litecoin MWEB Peg-in ${entityId.pegInIndex.toString()}`}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{entityId.pegInIndex.toString()}
	{/snippet}

	{#snippet Heading()}
		{entityId.pegInIndex.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={litecoinMwebPegIn}
			placeholderText={`Loading Litecoin MWEB Peg-in...`}
		>
			{#snippet children(litecoinMwebPegIn)}
				<dl>
					{#if litecoinMwebPegIn.amountLitoshis != null}
						<div>
							<dt>Amount Litoshis</dt>
							<dd><NumberValue value={litecoinMwebPegIn.amountLitoshis} /> litoshis</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
