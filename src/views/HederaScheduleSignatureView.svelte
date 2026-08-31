<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaScheduleSignature>, 'prefetched'> = $props()

	const schedule = $derived(selection.entitySelector.$schedule)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaScheduleView from '$/views/HederaScheduleView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaScheduleSignature}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/schedule/[scheduleId=stringSegment]/(hederaSchedule)/signature/[publicKeyPrefix=stringSegment]',
				{
					network: (
						'caip2' in schedule.$network ?
							caip2StringFromValue(schedule.$network.caip2)
						:
							schedule.$network.slug
					),
					scheduleId: schedule.scheduleId,
					publicKeyPrefix: selection.entitySelector.publicKeyPrefix,
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
				<dt>schedule</dt>
				<dd>
					<HederaScheduleView
						selection={select(EntityType.HederaSchedule, selection.entitySelector.$schedule)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>public key prefix</dt>
				<dd>
					{selection.entitySelector.publicKeyPrefix}
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
							signature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const signature = entity.signature}
					{#if signature != null}
						<div>
							<dt>signature</dt>
							<dd>
								<TruncatedValue value={signature} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(hederaAccount)}
					{#if hederaAccount != null}
						<div>
							<dt>account</dt>
							<dd>
								<HederaAccountView
									selection={select(EntityType.HederaAccount, hederaAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
