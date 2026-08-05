<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.FilecoinNetwork>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FilecoinNetwork_TimestampsView from '$/views/FilecoinNetwork_TimestampsView.svelte'
	import FilecoinTipsetsView from '$/views/FilecoinTipsetsView.svelte'
	import FilecoinDealsView from '$/views/FilecoinDealsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinNetwork}
	entitySelector={selection.entitySelector}
	title={title ?? 'filecoin network'}
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
		Filecoin
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>RPC endpoints</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources ?? [
									Source.Lotus_JsonRpc,
								],
							})({
								fields: {
									rpcEndpoints: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.rpcEndpoints.values.map((value) => value.url).join(', ')}
						{/snippet}
					</ResourceBoundary>
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
					<FilecoinNetwork_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const tipsetsResource = selection.$$tipsets}
		<ResourceBoundary
			resource={tipsetsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinTipsetsView
						selection={tipsetsResource}
						countResource={tipsetsResource.count}
						title='Tipsets'
						id='tipsets'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const dealsResource = selection.$$deals}
		<ResourceBoundary
			resource={dealsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinDealsView
						selection={dealsResource}
						countResource={dealsResource.count}
						title='Storage deals'
						id='deals'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
