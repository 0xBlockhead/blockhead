<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.MoveStruct> = $props()

	const moveStruct = $derived(selection({
		fields: {
			isEvent: true,
			isNative: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.structName || 'move struct')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MoveModuleView from '$/views/MoveModuleView.svelte'
</script>


<EntityView
	entityType={EntityType.MoveStruct}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.structName || 'move struct'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moveStruct}>
			{#snippet children(entity)}
				{[String(entity.isEvent ?? ''), String(entity.isNative ?? '')].filter(Boolean).join(' ') || selection.entitySelector.structName || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<MoveModuleView
				selection={select(EntityType.MoveModule, selection.entitySelector.$module)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>module</dt>
				<dd>
					<MoveModuleView
						selection={select(EntityType.MoveModule, selection.entitySelector.$module)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>struct name</dt>
				<dd>
					{selection.entitySelector.structName}
				</dd>
			</div>

			<ResourceBoundary
				resource={moveStruct}
			>
				{#snippet children(entity)}
					{@const isEvent = entity.isEvent}
					{#if isEvent != null}
						<div>
							<dt>is event</dt>
							<dd>
								{isEvent ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={moveStruct}
			>
				{#snippet children(entity)}
					{@const isNative = entity.isNative}
					{#if isNative != null}
						<div>
							<dt>is native</dt>
							<dd>
								{isNative ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>abilities</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									abilities: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.abilities.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
