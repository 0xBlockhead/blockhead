<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaTopicMessage>, 'prefetched'> = $props()

	const topic = $derived(selection.entitySelector.$topic)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaTopicView from '$/views/HederaTopicView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaTopicMessage}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/topic/[topicId=stringSegment]/(hederaTopic)/message/[sequenceNumber=nonNegativeBigInt]',
				{
					network: (
						'caip2' in topic.$network ?
							caip2StringFromValue(topic.$network.caip2)
						:
							topic.$network.slug
					),
					topicId: topic.topicId,
					sequenceNumber: String(selection.entitySelector.sequenceNumber),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>topic</dt>
				<dd>
					<HederaTopicView
						selection={select(EntityType.HederaTopic, selection.entitySelector.$topic)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>sequence number</dt>
				<dd>
					{selection.entitySelector.sequenceNumber}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusTimestamp: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const consensusTimestamp = entity.consensusTimestamp}
					{#if consensusTimestamp != null}
						<div>
							<dt>consensus timestamp</dt>
							<dd>
								{consensusTimestamp}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							runningHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const runningHash = entity.runningHash}
					{#if runningHash != null}
						<div>
							<dt>running hash</dt>
							<dd>
								<TruncatedValue value={runningHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payerAccount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const payerAccount = entity.payerAccount}
					{#if payerAccount != null}
						<div>
							<dt>payer account</dt>
							<dd>
								<TruncatedValue value={payerAccount} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							message: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const message = entity.message}
					{#if message != null}
						<div>
							<dt>message</dt>
							<dd>
								{message}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
