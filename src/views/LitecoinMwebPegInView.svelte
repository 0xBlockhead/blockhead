<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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

	const litecoinMwebPegIn = subscribe(EntityType.LitecoinMwebPegIn,
		entityId,
		({ fields: { amountLitoshis: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebPegIn}
	{entityId}
	title={`MWEB Peg-in #${entityId.pegInIndex.toString()}`}
	idDragPlainText={entityId.pegInIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{entityId.pegInIndex.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>MWEB Peg-in </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={litecoinMwebPegIn}
			placeholderText={`Loading Litecoin MWEB Peg-in...`}
		>
			{#snippet children(litecoinMwebPegIn)}
				<dl>
					{#if litecoinMwebPegIn.fields.amountLitoshis != null}
						<div>
							<dt>Amount Litoshis</dt>
							<dd><NumberValue value={litecoinMwebPegIn.fields.amountLitoshis} /> litoshis</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
