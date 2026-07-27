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
	}: EntitySelectionViewProps<EntityType.AptosAccountResource> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.resourceType ?? '') || 'aptos account resource')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosAccountResource_TimestampsView from '$/views/AptosAccountResource_TimestampsView.svelte'
	import AptosAccountView from '$/views/AptosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosAccountResource}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.resourceType ?? '') || 'aptos account resource'}
	{/snippet}

	{#snippet Value()}
		<AptosAccountView
			selection={select(EntityType.AptosAccount, selection.entitySelector.$account)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<AptosAccountView
						selection={select(EntityType.AptosAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>resource type</dt>
				<dd>
					{pendingEntity.resourceType}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const aptosAccountResourceAptosAccountResourceTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={aptosAccountResourceAptosAccountResourceTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AptosAccountResource_TimestampsView
						selection={aptosAccountResourceAptosAccountResourceTimestampsViewTimestampsResource}
						countResource={aptosAccountResourceAptosAccountResourceTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
