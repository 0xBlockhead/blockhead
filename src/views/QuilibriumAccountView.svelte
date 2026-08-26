<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.QuilibriumAccount>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const quilibriumAccount = $derived(selection({
		sources: selection.sources ?? [
			Source.QuilibriumNode_Grpc,
		],
		fields: {
			accountKind: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadQuilibriumAccountStatesView from '$/views/BlockheadQuilibriumAccountStatesView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.QuilibriumAccount}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.accountAddress || 'quilibrium account')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					accountId: selection.entitySelector.accountAddress,
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
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={quilibriumAccount}>
			{#snippet children(entity)}
				{@const accountKind = entity.accountKind}
				{#if accountKind != null}
					<span data-text="muted">
						{accountKind}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

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
				<dt>account address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.accountAddress} />
				</dd>
			</div>

			<ResourceBoundary
				resource={quilibriumAccount}
			>
				{#snippet children(entity)}
					{@const accountKind = entity.accountKind}
					{#if accountKind != null}
						<div>
							<dt>account kind</dt>
							<dd>
								{accountKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const blockheadAccountStatesResource = selection.$$blockheadAccountStates}
		<ResourceBoundary
			resource={blockheadAccountStatesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadQuilibriumAccountStatesView
						selection={blockheadAccountStatesResource}
						countResource={blockheadAccountStatesResource.count}
						title='blockhead account states'
						id='blockhead-account-states'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
