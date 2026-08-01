<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.EnsRecord> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EnsRecord_TimestampsView from '$/views/EnsRecord_TimestampsView.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<EntityView
	entityType={EntityType.EnsRecord}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.recordKey || 'ENS record')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]',
				{
					ensName: encodeURIComponent(selection.entitySelector.$name.name),
					recordId: encodeURIComponent(selection.entitySelector.recordKey),
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
		<EnsNameView
			selection={select(EntityType.EnsName, selection.entitySelector.$name)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Name</dt>
				<dd>
					<EnsNameView
						selection={select(EntityType.EnsName, selection.entitySelector.$name)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Record key</dt>
				<dd>
					{selection.entitySelector.recordKey}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Record kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									recordKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.recordKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							coinType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const coinType = entity.coinType}
					{#if coinType != null}
						<div>
							<dt>Coin type</dt>
							<dd>
								<NumberValue
									value={coinType}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EnsRecord_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
