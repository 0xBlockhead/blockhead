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
	}: EntitySelectionViewProps<EntityType.TonContract_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonContractView from '$/views/TonContractView.svelte'
</script>


<EntityView
	entityType={EntityType.TonContract_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON contract timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		TON contract timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>contract</dt>
				<dd>
					<TonContractView
						selection={select(EntityType.TonContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

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
					selection({
						fields: {
							interfaceKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const interfaceKind = entity.interfaceKind}
					{#if interfaceKind != null}
						<div>
							<dt>interface kind</dt>
							<dd>
								{interfaceKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							walletVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const walletVersion = entity.walletVersion}
					{#if walletVersion != null}
						<div>
							<dt>wallet version</dt>
							<dd>
								{walletVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							codeHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const codeHash = entity.codeHash}
					{#if codeHash != null}
						<div>
							<dt>code hash</dt>
							<dd>
								<TruncatedValue value={codeHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedSourceUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verifiedSourceUrl = entity.verifiedSourceUrl}
					{#if verifiedSourceUrl != null}
						<div>
							<dt>verified source URL</dt>
							<dd>
								<a
									href={verifiedSourceUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={verifiedSourceUrl} />
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
							verifiedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verifiedAtMs = entity.verifiedAtMs}
					{#if verifiedAtMs != null}
						<div>
							<dt>verified AT ms</dt>
							<dd>
								{verifiedAtMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verification: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verification = entity.verification}
					{#if verification != null}
						<div>
							<dt>verification</dt>
							<dd>
								{verification}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
