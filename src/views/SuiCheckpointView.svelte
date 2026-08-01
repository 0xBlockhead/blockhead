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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SuiCheckpoint>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiNetworkView from '$/views/SuiNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiCheckpoint}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui checkpoint'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<SuiNetworkView
						selection={select(EntityType.SuiNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>sequence</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sequence: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.sequence}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>digest</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									digest: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.digest} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							epoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epoch = entity.epoch}
					{#if epoch != null}
						<div>
							<dt>epoch</dt>
							<dd>
								{epoch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousDigest: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previousDigest = entity.previousDigest}
					{#if previousDigest != null}
						<div>
							<dt>previous digest</dt>
							<dd>
								<TruncatedValue value={previousDigest} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
