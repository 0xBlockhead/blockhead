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
	}: EntitySelectionViewProps<EntityType.CardanoDRep_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoDRepView from '$/views/CardanoDRepView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoDRep_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'Cardano DRep timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>drep</dt>
				<dd>
					<CardanoDRepView
						selection={select(EntityType.CardanoDRep, selection.entitySelector.$drep)}
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
							votingPowerLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const votingPowerLovelace = entity.votingPowerLovelace}
					{#if votingPowerLovelace != null}
						<div>
							<dt>voting power lovelace</dt>
							<dd>
								{votingPowerLovelace}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegatorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegatorCount = entity.delegatorCount}
					{#if delegatorCount != null}
						<div>
							<dt>delegator count</dt>
							<dd>
								{delegatorCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							active: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const active = entity.active}
					{#if active != null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							registered: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const registered = entity.registered}
					{#if registered != null}
						<div>
							<dt>registered</dt>
							<dd>
								{registered ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							depositLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const depositLovelace = entity.depositLovelace}
					{#if depositLovelace != null}
						<div>
							<dt>deposit lovelace</dt>
							<dd>
								{depositLovelace}
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
		</dl>
	{/snippet}
</EntityView>
