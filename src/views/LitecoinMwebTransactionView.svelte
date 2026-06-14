<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.LitecoinMwebTransaction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const litecoinMwebTransaction = subscribe(EntityType.LitecoinMwebTransaction,
		selector,
		({ fields: { kernelOffset: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebTransaction}
	entitySelector={selector}
	title={`MWEB Transaction #${selector.transactionIndex.toString()}`}
	idDragPlainText={selector.transactionIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{selector.transactionIndex.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>MWEB Transaction </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={litecoinMwebTransaction}
			placeholderText={`Loading Litecoin MWEB Transaction...`}
		>
			{#snippet children(litecoinMwebTransaction)}
				<dl>
					{#if litecoinMwebTransaction.fields.kernelOffset != null}
						<div>
							<dt>Kernel Offset</dt>
							<dd>{litecoinMwebTransaction.fields.kernelOffset}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
