<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType._GlobalIpfsAccess_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
			Source.Ipfs_Rest,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalIpfsAccessView from '$/views/_GlobalIpfsAccessView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalIpfsAccess_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'global IPFS access timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<GlobalIpfsAccessView
			selection={select(EntityType._GlobalIpfsAccess, selection.entitySelector.$hub)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Hub</dt>
				<dd>
					<GlobalIpfsAccessView
						selection={select(EntityType._GlobalIpfsAccess, selection.entitySelector.$hub)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							declaredAccessEndpointCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const declaredAccessEndpointCount = entity.declaredAccessEndpointCount}
					{#if declaredAccessEndpointCount != null}
						<div>
							<dt>Declared access endpoints</dt>
							<dd>
								<NumberValue
									value={declaredAccessEndpointCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							reachableAccessEndpointCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reachableAccessEndpointCount = entity.reachableAccessEndpointCount}
					{#if reachableAccessEndpointCount != null}
						<div>
							<dt>Reachable access endpoints</dt>
							<dd>
								<NumberValue
									value={reachableAccessEndpointCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							reachable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reachable = entity.reachable}
					{#if reachable != null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
