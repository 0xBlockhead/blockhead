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
	}: EntitySelectionViewProps<EntityType.IcpCanisterLog_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import IcpCanisterView from '$/views/IcpCanisterView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpCanisterLog_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP canister log timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		ICP canister log timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>canister</dt>
				<dd>
					<IcpCanisterView
						selection={select(EntityType.IcpCanister, selection.entitySelector.$canister)}
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
							lastAnalyzedMessageTimeNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastAnalyzedMessageTimeNs = entity.lastAnalyzedMessageTimeNs}
					{#if lastAnalyzedMessageTimeNs != null}
						<div>
							<dt>last analyzed message time ns</dt>
							<dd>
								{lastAnalyzedMessageTimeNs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							messageCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const messageCount = entity.messageCount}
					{#if messageCount != null}
						<div>
							<dt>message count</dt>
							<dd>
								{messageCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							logVisibility: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const logVisibility = entity.logVisibility}
					{#if logVisibility != null}
						<div>
							<dt>log visibility</dt>
							<dd>
								{logVisibility}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
