<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: Omit<EntitySelectionViewProps<EntityType.MoveModule>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewDomId = $derived('move-module-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import MoveFunctionsView from '$/views/MoveFunctionsView.svelte'
	import MoveStructsView from '$/views/MoveStructsView.svelte'
	import MoveModule_TimestampsView from '$/views/MoveModule_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.MoveModule}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.moduleName || 'move module')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/move/module/[address=stringSegment]/[moduleName=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					address: selection.entitySelector.address,
					moduleName: selection.entitySelector.moduleName,
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
		<TruncatedValue value={selection.entitySelector.address} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
				</dd>
			</div>

			<div>
				<dt>module name</dt>
				<dd>
					{selection.entitySelector.moduleName}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-move-module-abi'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'move-module-functions',
						label: 'Functions',
					},
					{
						id: 'move-module-structs',
						label: 'Structs',
					},
				]
			}
			data-card
			class='network-view-collapsible-abi'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>ABI</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionMoveModuleFunctions({ id, label })}
				<MoveFunctionsView
					selection={selection.$$functions}
					collapsible={false}
					title={label}
					emptyText='No functions found.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionMoveModuleStructs({ id, label })}
				<MoveStructsView
					selection={selection.$$structs}
					collapsible={false}
					title={label}
					emptyText='No structs found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-move-module-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'move-module-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionMoveModuleTimestamps({ id, label })}
				<MoveModule_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
