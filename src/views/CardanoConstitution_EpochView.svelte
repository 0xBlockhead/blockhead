<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.CardanoConstitution_Epoch> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoConstitution_Epoch}
	entitySelector={selection.entitySelector}
	title={title ?? 'Cardano constitution epoch'}
	{layout}
	bind:open
	{...EntityViewProps}
>
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
				<dt>epoch</dt>
				<dd>
					{selection.entitySelector.epoch}
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
					selection({
						fields: {
							slot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slot = entity.slot}
					{#if slot != null}
						<div>
							<dt>slot</dt>
							<dd>
								{slot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							anchorUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const anchorUrl = entity.anchorUrl}
					{#if anchorUrl != null}
						<div>
							<dt>anchor URL</dt>
							<dd>
								<a
									href={anchorUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={anchorUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							anchorHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const anchorHash = entity.anchorHash}
					{#if anchorHash != null}
						<div>
							<dt>anchor hash</dt>
							<dd>
								<TruncatedValue value={anchorHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							scriptHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const scriptHash = entity.scriptHash}
					{#if scriptHash != null}
						<div>
							<dt>script hash</dt>
							<dd>
								<TruncatedValue value={scriptHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousAnchorUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previousAnchorUrl = entity.previousAnchorUrl}
					{#if previousAnchorUrl != null}
						<div>
							<dt>previous anchor URL</dt>
							<dd>
								<a
									href={previousAnchorUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={previousAnchorUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousAnchorHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previousAnchorHash = entity.previousAnchorHash}
					{#if previousAnchorHash != null}
						<div>
							<dt>previous anchor hash</dt>
							<dd>
								<TruncatedValue value={previousAnchorHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
