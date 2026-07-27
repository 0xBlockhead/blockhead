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
	}: EntitySelectionViewProps<EntityType.AvailAppId> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const availAppId = $derived(selection({
		fields: {
			label: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.label ?? '') || String(pendingEntity.appId ?? '') || 'avail app ID')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AvailAppId_TimestampsView from '$/views/AvailAppId_TimestampsView.svelte'
	import AvailDataSubmissionsView from '$/views/AvailDataSubmissionsView.svelte'
	import AvailNetworkView from '$/views/AvailNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AvailAppId}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={availAppId}>
			{#snippet children(entity)}
				{(entity.label ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={pendingEntity.appId}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AvailNetworkView
						selection={select(EntityType.AvailNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>app ID</dt>
				<dd>
					<NumberValue
						value={pendingEntity.appId}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={availAppId}
			>
				{#snippet children(entity)}
					{@const label = entity.label}
					{#if label != null}
						<div>
							<dt>Label</dt>
							<dd>
								{label}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const availAppIdAvailAppIdTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={availAppIdAvailAppIdTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvailAppId_TimestampsView
						selection={availAppIdAvailAppIdTimestampsViewTimestampsResource}
						countResource={availAppIdAvailAppIdTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const availAppIdAvailDataSubmissionsViewDataSubmissionsResource = selection.$$dataSubmissions}
		<ResourceBoundary
			resource={availAppIdAvailDataSubmissionsViewDataSubmissionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvailDataSubmissionsView
						selection={availAppIdAvailDataSubmissionsViewDataSubmissionsResource}
						countResource={availAppIdAvailDataSubmissionsViewDataSubmissionsResource.count}
						title='data submissions'
						id='data-submissions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
