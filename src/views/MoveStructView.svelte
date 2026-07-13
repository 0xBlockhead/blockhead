<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.MoveStruct>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.MoveStruct>>
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
	const moveStruct = $derived(selection({
		fields: {
			isEvent: true,
			isNative: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.structName) ?? '')].filter(Boolean).join(' ') || 'move struct')
	const viewDomId = $derived('move-struct-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MoveModuleView from '$/views/MoveModuleView.svelte'
</script>


<EntityView
	entityType={EntityType.MoveStruct}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={moveStruct}>
			{#snippet Pending()}
				{[String((pendingEntity.structName) ?? '')].filter(Boolean).join(' ') || title || 'move struct'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.structName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moveStruct}>
			{#snippet Pending()}
				{[String((pendingEntity.isEvent) ?? ''), String((pendingEntity.isNative) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.structName) ?? '')].filter(Boolean).join(' ') || title || 'move struct'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.isEvent) ?? ''), String((resolvedEntity.isNative) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.structName) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={moveStruct}>
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
				<dt>struct name</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									structName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const structName = pendingEntity.structName}
							{#if structName !== undefined && structName !== null}
								{String((structName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const structName = resolvedEntity.structName}
							{#if structName !== undefined && structName !== null}
								{String((structName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isEvent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isEvent = pendingEntity.isEvent}
					{#if isEvent !== undefined && isEvent !== null}
						<div>
							<dt>is event</dt>
							<dd>
								{isEvent ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isEvent = resolvedEntity.isEvent}
					{#if isEvent !== undefined && isEvent !== null}
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
				resource={
					selection({
						fields: {
							isNative: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isNative = pendingEntity.isNative}
					{#if isNative !== undefined && isNative !== null}
						<div>
							<dt>is native</dt>
							<dd>
								{isNative ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isNative = resolvedEntity.isNative}
					{#if isNative !== undefined && isNative !== null}
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
						{#snippet Pending()}
							{@const abilities = pendingEntity.abilities}
							{#if abilities !== undefined && abilities !== null}
								{abilities.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const abilities = resolvedEntity.abilities}
							{#if abilities !== undefined && abilities !== null}
								{abilities.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
