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
			entityId: EntityId<typeof schema, EntityType.CosmosMessage>
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

	const cosmosMessage = useEntity(
		EntityType.CosmosMessage,
		entityId,
		{
			typeUrl: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosMessage}
	{entityId}
	title={`Cosmos Message ${entityId.messageIndex.toString()}`}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{entityId.messageIndex.toString()}
	{/snippet}

	{#snippet Heading()}
		{entityId.messageIndex.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={cosmosMessage}
			placeholderText={`Loading Cosmos Message...`}
		>
			{#snippet children(cosmosMessage)}
				<dl>
					{#if cosmosMessage.typeUrl != null}
						<div>
							<dt>Type URL</dt>
							<dd>{cosmosMessage.typeUrl}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
