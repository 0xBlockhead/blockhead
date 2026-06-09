<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.MevBuilder>
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const builder = useEntity(entityCollectionsContext, EntityType.MevBuilder,
		entityId,
		(
			open ?
				{
					sources: [
						Source.MevRelay_Rest,
					],
					fields: {
						deliveredPayloadCount: true,
					},
				}
			:
				{ fields: {} }
		),
	)


	// (Derived)
	const title = $derived(
		titleProp
		?? `MEV builder ${entityId.builderPubkey}`
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.MevBuilder}
	{entityId}
	{title}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.builderPubkey}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		{title}
	{/snippet}

	{#snippet Content()}
		{#if open}
			<ResourceBoundary
				resource={builder}
				placeholderText="Loading MEV builder…"
			>
				{#snippet children(builder)}
					<dl data-column-item="center">
						{#if builder.fields.deliveredPayloadCount !== undefined}
							<div>
								<dt>Delivered payloads</dt>
								<dd><NumberValue value={builder.fields.deliveredPayloadCount} /></dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
