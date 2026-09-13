<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EvmTopic>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmTopic}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.hex || 'EVM topic')}
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
		<span data-text="font-monospace">{selection.entitySelector.hex}</span>
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
							sources: selection.sources ?? [
								Source.Openchain_Rest,
								Source.FourByteDirectory_Rest,
							],
						}).signatures
					}
				>
					{#snippet children(signatures)}
						<div>
							<dt>Candidate signatures</dt>
							<dd>
								{#if signatures.values.length}
									<ul>
										{#each signatures.values as candidateSignature}
											<li><code>{candidateSignature}</code></li>
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
</EntityView>
