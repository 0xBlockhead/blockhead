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
			entityId: EntityId<typeof schema, EntityType.PolkadotEvent>
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

	const polkadotEvent = useEntity(
		EntityType.PolkadotEvent,
		entityId,
		{
			eventName: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotEvent}
	{entityId}
	title={`Polkadot Event ${entityId.eventIndex.toString()}`}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{entityId.eventIndex.toString()}
	{/snippet}

	{#snippet Heading()}
		{entityId.eventIndex.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={polkadotEvent}
			placeholderText={`Loading Polkadot Event...`}
		>
			{#snippet children(polkadotEvent)}
				<dl>
					{#if polkadotEvent.eventName != null}
						<div>
							<dt>Event Name</dt>
							<dd>{polkadotEvent.eventName}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
