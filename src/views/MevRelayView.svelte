<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(false),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.MevRelay>
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const relay = subscribe(EntityType.MevRelay,
		selector,
		{
			sources: [
				Source.Constants_Internal,
			],
			fields: {
				url: true,
			},
		},
	)


	// (Derived)
	const title = $derived(
		titleProp
		?? selector.host
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.MevRelay}
	entitySelector={selector}
	{title}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selector.host}
		</span>
	{/snippet}

	{#snippet Title()}
		{title}
	{/snippet}

	{#snippet Content()}
		{#if open}
			<ResourceBoundary
				resource={relay}
				placeholderText="Loading MEV relay…"
			>
				{#snippet children(relay)}
					<dl data-column-item="center">
						{#if relay.fields.url !== undefined}
							<div>
								<dt>URL</dt>
								<dd>{relay.fields.url}</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
