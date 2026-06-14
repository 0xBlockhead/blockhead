<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	let {
		selector,
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BeaconSlashing>
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const title = $derived(
		titleProp
		?? `${selector.kind} slashing · slot ${selector.slot.toLocaleString()}`
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSlashing}
	entitySelector={selector}
	{title}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.kind}
		</span>
	{/snippet}

	{#snippet Title()}
		{title}
	{/snippet}

	{#snippet Content()}
		{#if open}
			<dl data-column-item="center">
				<div>
					<dt>Index</dt>
					<dd><NumberValue value={selector.index} /></dd>
				</div>
			</dl>
		{/if}
	{/snippet}
</EntityView>
