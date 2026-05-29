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
			entityId: EntityId<typeof schema, EntityType.LitecoinMwebPegOut>
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

	const litecoinMwebPegOut = useEntity(
		EntityType.LitecoinMwebPegOut,
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
	entityType={EntityType.LitecoinMwebPegOut}
	{entityId}
	title={`Litecoin MWEB Peg-out ${entityId.pegOutIndex.toString()}`}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{entityId.pegOutIndex.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={litecoinMwebPegOut}
			placeholderText={`Loading Litecoin MWEB Peg-out...`}
		>
			{#snippet children(litecoinMwebPegOut)}
				<dl>
					{#if litecoinMwebPegOut.amountLitoshis != null}
						<div>
							<dt>Amount Litoshis</dt>
							<dd><NumberValue value={litecoinMwebPegOut.amountLitoshis} /> litoshis</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
