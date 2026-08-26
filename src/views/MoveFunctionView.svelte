<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.MoveFunction>, 'prefetched'> = $props()

	const module = $derived(selection.entitySelector.$module)
	const moveFunction = $derived(selection({
		fields: {
			visibility: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.functionName || 'move function')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MoveModuleView from '$/views/MoveModuleView.svelte'
</script>


<EntityView
	entityType={EntityType.MoveFunction}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/move/module/[address=stringSegment]/[moduleName=stringSegment]/(moveModule)/function/[functionName=stringSegment]',
				{
					network: (
						'caip2' in module.$network ?
							caip2StringFromValue(module.$network.caip2)
						:
							module.$network.slug
					),
					address: module.address,
					moduleName: module.moduleName,
					functionName: selection.entitySelector.functionName,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={moveFunction}>
			{#snippet children(entity)}
				{(entity.visibility ?? '') || selection.entitySelector.functionName || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<MoveModuleView
				selection={select(EntityType.MoveModule, selection.entitySelector.$module)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>module</dt>
				<dd>
					<MoveModuleView
						selection={select(EntityType.MoveModule, selection.entitySelector.$module)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>function name</dt>
				<dd>
					{selection.entitySelector.functionName}
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
