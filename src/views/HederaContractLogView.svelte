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
	}: Omit<EntitySelectionViewProps<EntityType.HederaContractLog>, 'prefetched'> = $props()

	const contract = $derived(selection.entitySelector.$contract)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaContractResultView from '$/views/HederaContractResultView.svelte'
	import HederaContractView from '$/views/HederaContractView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaContractLog}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			(
				'$result' in selection.entitySelector
				&& 'consensusTimestamp' in selection.entitySelector.$result.$transaction ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/contract-result/(hederaContractResult)/log/[logIndex=nonNegativeInteger]',
						{
							network: (
								'caip2' in selection.entitySelector.$result.$transaction.$network ?
									caip2StringFromValue(selection.entitySelector.$result.$transaction.$network.caip2)
								:
									selection.entitySelector.$result.$transaction.$network.slug
							),
							consensusTimestamp: selection.entitySelector.$result.$transaction.consensusTimestamp,
							logIndex: String(selection.entitySelector.logIndex),
						}
					)
				:
					'consensusTimestamp' in selection.entitySelector
					&& '$contract' in selection.entitySelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/consensus-log/[consensusTimestamp=stringSegment]/[logIndex=nonNegativeInteger]',
							{
								network: (
									'caip2' in contract.$network ?
										caip2StringFromValue(contract.$network.caip2)
									:
										contract.$network.slug
								),
								address: contract.contractId,
								consensusTimestamp: selection.entitySelector.consensusTimestamp,
								logIndex: String(selection.entitySelector.logIndex),
							}
						)
					:
						undefined
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
				<dt>result</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$result}
					>
						{#snippet children(hederaContractResult)}
							<HederaContractResultView
								selection={select(EntityType.HederaContractResult, hederaContractResult[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>contract</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$contract}
					>
						{#snippet children(hederaContract)}
							<HederaContractView
								selection={select(EntityType.HederaContract, hederaContract[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>consensus timestamp</dt>
				<dd>
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
							{entity.consensusTimestamp}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>log index</dt>
				<dd>
					{selection.entitySelector.logIndex}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							address: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const address = entity.address}
					{#if address != null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={address} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bloom: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bloom = entity.bloom}
					{#if bloom != null}
						<div>
							<dt>bloom</dt>
							<dd>
								{bloom}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							data: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const data = entity.data}
					{#if data != null}
						<div>
							<dt>data</dt>
							<dd>
								{data}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>topics</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									topics: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.topics.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
