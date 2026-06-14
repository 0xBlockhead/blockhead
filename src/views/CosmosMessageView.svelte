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
			selector: EntitySelector<typeof schema, EntityType.CosmosMessage>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const cosmosMessage = subscribe(EntityType.CosmosMessage,
		selector,
		({ fields: { typeUrl: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosMessage}
	entitySelector={selector}
	title={`Message #${selector.messageIndex.toString()}`}
	idDragPlainText={selector.messageIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{selector.messageIndex.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Message </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={cosmosMessage}
			placeholderText={`Loading Cosmos Message...`}
		>
			{#snippet children(cosmosMessage)}
				<dl>
					{#if cosmosMessage.fields.typeUrl != null}
						<div>
							<dt>Type URL</dt>
							<dd>{cosmosMessage.fields.typeUrl}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
