<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.WormholeVaa> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Wormholescan,
		],
	}))
	const wormholeVaa = $derived(viewSelection({
		fields: {
			digest: true,
		},
	}))
	const titleFallback = $derived((prefetched.digest ?? '') || 'Wormhole VAA')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.WormholeVaa}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={wormholeVaa}>
			{#snippet children(entity)}
				{entity.digest || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{[String(selection.entitySelector.emitterChain), selection.entitySelector.sequence].filter(Boolean).join(' ') || (prefetched.digest ?? '') || titleFallback}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Emitter chain</dt>
				<dd>
					{selection.entitySelector.emitterChain}
				</dd>
			</div>

			<div>
				<dt>Emitter</dt>
				<dd>
					{selection.entitySelector.emitter}
				</dd>
			</div>

			<div>
				<dt>Sequence</dt>
				<dd>
					{selection.entitySelector.sequence}
				</dd>
			</div>

			<div>
				<dt>Digest</dt>
				<dd>
					<ResourceBoundary
						resource={wormholeVaa}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.digest} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Guardian set index</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									guardianSetIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.guardianSetIndex}
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
							emitterNativeAddr: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const emitterNativeAddr = entity.emitterNativeAddr}
					{#if emitterNativeAddr != null}
						<div>
							<dt>Emitter native address</dt>
							<dd>
								{emitterNativeAddr}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									timestamp: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={Number(entity.timestamp)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							txHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const txHash = entity.txHash}
					{#if txHash != null}
						<div>
							<dt>Transaction hash</dt>
							<dd>
								{txHash}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
