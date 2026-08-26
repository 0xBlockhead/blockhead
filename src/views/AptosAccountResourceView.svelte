<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AptosAccountResource>, 'prefetched'> = $props()

	const account = $derived(selection.entitySelector.$account)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AptosAccountResource_TimestampsView from '$/views/AptosAccountResource_TimestampsView.svelte'
	import AptosAccountView from '$/views/AptosAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosAccountResource}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.resourceType || 'aptos account resource')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/resource/[resourceType=stringSegment]',
				{
					network: (
						'caip2' in account.$network.$network ?
							caip2StringFromValue(account.$network.$network.caip2)
						:
							account.$network.$network.slug
					),
					accountId: account.address,
					resourceType: selection.entitySelector.resourceType,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<AptosAccountView
			selection={select(EntityType.AptosAccount, selection.entitySelector.$account)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<AptosAccountView
						selection={select(EntityType.AptosAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>resource type</dt>
				<dd>
					{selection.entitySelector.resourceType}
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AptosAccountResource_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
