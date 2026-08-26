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
	}: Omit<EntitySelectionViewProps<EntityType.StarknetStorageEntry>, 'prefetched'> = $props()

	const contract = $derived(selection.entitySelector.$contract)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import StarknetStorageEntry_TimestampsView from '$/views/StarknetStorageEntry_TimestampsView.svelte'
	import StarknetContractView from '$/views/StarknetContractView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetStorageEntry}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.storageKey || 'starknet storage entry')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/storage/[storageKey=stringSegment]',
				{
					network: (
						'caip2' in contract.$network.$network ?
							caip2StringFromValue(contract.$network.$network.caip2)
						:
							contract.$network.$network.slug
					),
					accountId: contract.address,
					storageKey: selection.entitySelector.storageKey,
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
		<StarknetContractView
			selection={select(EntityType.StarknetContract, selection.entitySelector.$contract)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>contract</dt>
				<dd>
					<StarknetContractView
						selection={select(EntityType.StarknetContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>storage key</dt>
				<dd>
					{selection.entitySelector.storageKey}
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
					<StarknetStorageEntry_TimestampsView
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
