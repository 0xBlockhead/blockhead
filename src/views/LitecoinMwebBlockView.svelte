<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.LitecoinMwebBlock>
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
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebBlock}
	entitySelector={selector}
	title={`MWEB Block #${selector.$block.height.toString()}`}
	idDragPlainText={selector.$block.height.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{selector.$block.height.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>MWEB Block </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={proxy(EntityType.LitecoinMwebBlock, selector, ({ fields: { hogExTransactionId: true, kernelRoot: true } }))}
			placeholderText={`Loading Litecoin MWEB Block...`}
		>
			{#snippet children(litecoinMwebBlock)}
				<dl>
					{#if litecoinMwebBlock.fields.hogExTransactionId != null}
						<div>
							<dt>Hog Ex Transaction ID</dt>
							<dd>
								<TruncatedValue
									value={litecoinMwebBlock.fields.hogExTransactionId}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if litecoinMwebBlock.fields.kernelRoot != null}
						<div>
							<dt>Kernel Root</dt>
							<dd>
								<TruncatedValue
									value={litecoinMwebBlock.fields.kernelRoot}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
