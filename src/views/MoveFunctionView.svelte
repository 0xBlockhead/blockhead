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
	}: EntitySelectionViewProps<EntityType.MoveFunction> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const moveFunction = $derived(selection({
		fields: {
			visibility: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.functionName ?? '') || 'move function')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MoveModuleView from '$/views/MoveModuleView.svelte'
</script>


<EntityView
	entityType={EntityType.MoveFunction}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.functionName ?? '') || 'move function'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moveFunction}>
			{#snippet children(entity)}
				{(entity.visibility ?? '') || pendingEntity.functionName || titleFallback}
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
				<dt>function name</dt>
				<dd>
					{pendingEntity.functionName}
				</dd>
			</div>

			<ResourceBoundary
				resource={moveFunction}
			>
				{#snippet children(entity)}
					{@const visibility = entity.visibility}
					{#if visibility != null}
						<div>
							<dt>visibility</dt>
							<dd>
								{visibility}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isEntry: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isEntry = entity.isEntry}
					{#if isEntry != null}
						<div>
							<dt>is entry</dt>
							<dd>
								{isEntry ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isView: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isView = entity.isView}
					{#if isView != null}
						<div>
							<dt>is view</dt>
							<dd>
								{isView ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>parameters</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									parameters: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.parameters.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>return types</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									returnTypes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.returnTypes.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
