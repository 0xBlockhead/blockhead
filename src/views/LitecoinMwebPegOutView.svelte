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
			selector: EntitySelector<typeof schema, EntityType.LitecoinMwebPegOut>
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
	entityType={EntityType.LitecoinMwebPegOut}
	entitySelector={selector}
	title={`MWEB Peg-out #${selector.pegOutIndex.toString()}`}
	idDragPlainText={selector.pegOutIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{selector.pegOutIndex.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>MWEB Peg-out </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.LitecoinMwebPegOut, selector, ({ fields: { amountLitoshis: true } }))}
			placeholderText={`Loading Litecoin MWEB Peg-out...`}
		>
			{#snippet children(litecoinMwebPegOut)}
				<dl>
					{#if litecoinMwebPegOut.fields.amountLitoshis != null}
						<div>
							<dt>Amount Litoshis</dt>
							<dd><NumberValue value={litecoinMwebPegOut.fields.amountLitoshis} /> litoshis</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
