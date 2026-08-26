<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AvailNetwork>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AvailNetwork_TimestampsView from '$/views/AvailNetwork_TimestampsView.svelte'
	import AvailBlocksView from '$/views/AvailBlocksView.svelte'
	import AvailAppIdsView from '$/views/AvailAppIdsView.svelte'
	import AvailDataSubmissionsView from '$/views/AvailDataSubmissionsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AvailNetwork}
	entitySelector={selection.entitySelector}
	title={title ?? 'avail network'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		Avail
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
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvailNetwork_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blocksResource = selection.$$blocks}
		<ResourceBoundary
			resource={blocksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvailBlocksView
						selection={blocksResource}
						countResource={blocksResource.count}
						title='blocks'
						id='blocks'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const appIdsResource = selection.$$appIds}
		<ResourceBoundary
			resource={appIdsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvailAppIdsView
						selection={appIdsResource}
						countResource={appIdsResource.count}
						title='app ids'
						id='app-ids'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const dataSubmissionsResource = selection.$$dataSubmissions}
		<ResourceBoundary
			resource={dataSubmissionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvailDataSubmissionsView
						selection={dataSubmissionsResource}
						countResource={dataSubmissionsResource.count}
						title='data submissions'
						id='data-submissions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
