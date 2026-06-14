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
			selector: EntitySelector<typeof schema, EntityType.PolkadotEvent>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const polkadotEvent = subscribe(EntityType.PolkadotEvent,
		selector,
		({ fields: { eventName: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotEvent}
	entitySelector={selector}
	title={`Event #${selector.eventIndex.toString()}`}
	idDragPlainText={selector.eventIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{selector.eventIndex.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Event </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={polkadotEvent}
			placeholderText={`Loading Polkadot Event...`}
		>
			{#snippet children(polkadotEvent)}
				<dl>
					{#if polkadotEvent.fields.eventName != null}
						<div>
							<dt>Event Name</dt>
							<dd>{polkadotEvent.fields.eventName}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
