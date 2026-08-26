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
	}: Omit<EntitySelectionViewProps<EntityType.MoveStruct>, 'prefetched'> = $props()

	const module = $derived(selection.entitySelector.$module)
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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/move/module/[address=stringSegment]/[moduleName=stringSegment]/(moveModule)/struct/[structName=stringSegment]',
				{
					network: (
						'caip2' in module.$network ?
							caip2StringFromValue(module.$network.caip2)
						:
							module.$network.slug
					),
					address: module.address,
					moduleName: module.moduleName,
					structName: selection.entitySelector.structName,
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
