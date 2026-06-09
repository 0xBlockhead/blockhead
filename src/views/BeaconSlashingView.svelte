<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	let {
		entityId,
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BeaconSlashing>
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
		?? `${entityId.kind} slashing · slot ${entityId.slot.toLocaleString()}`
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSlashing}
	{entityId}
	{title}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.kind}
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
					<dd><NumberValue value={entityId.index} /></dd>
				</div>
			</dl>
		{/if}
	{/snippet}
</EntityView>
