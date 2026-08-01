<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmTopic> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmTopic_TimestampsView from '$/views/EvmTopic_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTopic}
	entitySelector={selection.entitySelector}
	title={title ?? 'EVM topic'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]',
				{
					hex: selection.entitySelector.hex,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources ?? [
						Source.Openchain_Rest,
					],
				})({
					fields: {
						signatures: true,
					},
				})
			}
			placeholderText="Loading log topic..."
		>
			{#snippet Pending()}
				{selection.entitySelector.hex}
			{/snippet}

			{#snippet children(entity)}
				{entity.signatures.values[0] ?? selection.entitySelector.hex}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">{selection.entitySelector.hex}</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Topic</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.hex} />
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								signatures: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						<div>
							<dt>Signatures</dt>
							<dd>
								{#if entity.signatures.values.length}
									<ul>
										{#each entity.signatures.values as signature (signature)}
											<li><code>{signature}</code></li>
										{/each}
									</ul>
								{:else}
									<p data-text="muted">No catalog signatures matched this log topic hash.</p>
								{/if}
							</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmTopic_TimestampsView
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
