<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.MoveFunction>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.MoveFunction>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const moveFunction = $derived(selection({
		fields: {
			visibility: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.functionName) ?? '')].filter(Boolean).join(' ') || 'move function')
	const viewDomId = $derived('move-function-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MoveModuleView from '$/views/MoveModuleView.svelte'
</script>


<EntityView
	entityType={EntityType.MoveFunction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={moveFunction}>
			{#snippet Pending()}
				{[String((pendingEntity.functionName) ?? '')].filter(Boolean).join(' ') || title || 'move function'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.functionName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moveFunction}>
			{#snippet Pending()}
				{[String((pendingEntity.visibility) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.functionName) ?? '')].filter(Boolean).join(' ') || title || 'move function'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.visibility) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.functionName) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={moveFunction}>
			{#snippet Pending()}
				<span data-text="muted">
					<MoveModuleView
						selection={select(EntityType.MoveModule, selection.entitySelector.$module)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<MoveModuleView
						selection={select(EntityType.MoveModule, selection.entitySelector.$module)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>module</dt>
				<dd>
					<MoveModuleView
						selection={select(EntityType.MoveModule, selection.entitySelector.$module, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>function name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									functionName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const functionName = pendingEntity.functionName}
							{#if functionName !== undefined && functionName !== null}
								{String((functionName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const functionName = resolvedEntity.functionName}
							{#if functionName !== undefined && functionName !== null}
								{String((functionName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							visibility: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const visibility = pendingEntity.visibility}
					{#if visibility !== undefined && visibility !== null}
						<div>
							<dt>visibility</dt>
							<dd>
								{String((visibility) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const visibility = resolvedEntity.visibility}
					{#if visibility !== undefined && visibility !== null}
						<div>
							<dt>visibility</dt>
							<dd>
								{String((visibility) ?? '')}
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
				{#snippet Pending()}
					{@const isEntry = pendingEntity.isEntry}
					{#if isEntry !== undefined && isEntry !== null}
						<div>
							<dt>is entry</dt>
							<dd>
								{isEntry ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isEntry = resolvedEntity.isEntry}
					{#if isEntry !== undefined && isEntry !== null}
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
				{#snippet Pending()}
					{@const isView = pendingEntity.isView}
					{#if isView !== undefined && isView !== null}
						<div>
							<dt>is view</dt>
							<dd>
								{isView ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isView = resolvedEntity.isView}
					{#if isView !== undefined && isView !== null}
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
						{#snippet Pending()}
							{@const parameters = pendingEntity.parameters}
							{#if parameters !== undefined && parameters !== null}
								{parameters.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const parameters = resolvedEntity.parameters}
							{#if parameters !== undefined && parameters !== null}
								{parameters.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
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
						{#snippet Pending()}
							{@const returnTypes = pendingEntity.returnTypes}
							{#if returnTypes !== undefined && returnTypes !== null}
								{returnTypes.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const returnTypes = resolvedEntity.returnTypes}
							{#if returnTypes !== undefined && returnTypes !== null}
								{returnTypes.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
