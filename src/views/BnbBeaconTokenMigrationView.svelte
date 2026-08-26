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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BnbBeaconTokenMigration> = $props()

	const token = $derived(selection.entitySelector.$token)
	const bnbBeaconTokenMigration = $derived(selection({
		fields: {
			migrationKind: true,
		},
	}))
	const titleFallback = $derived((prefetched.migrationKind ?? '') || 'bnb beacon token migration')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BnbBeaconTokenMigration_TimestampsView from '$/views/BnbBeaconTokenMigration_TimestampsView.svelte'
	import BnbBeaconTokenView from '$/views/BnbBeaconTokenView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconTokenMigration}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'slug' in selection.entitySelector.$targetNetwork ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/token/[symbol=stringSegment]/(bnbBeaconToken)/migration/[targetNetwork=networkSlug]/[targetAddress=stringSegment]',
						{
							network: (
								'caip2' in token.$network.$network ?
									caip2StringFromValue(token.$network.$network.caip2)
								:
									token.$network.$network.slug
							),
							symbol: token.symbol,
							targetNetwork: selection.entitySelector.$targetNetwork.slug,
							targetAddress: selection.entitySelector.targetAddress,
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
	{#snippet Title()}
		<ResourceBoundary resource={bnbBeaconTokenMigration}>
			{#snippet children(entity)}
				{entity.migrationKind || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<BnbBeaconTokenView
			selection={select(EntityType.BnbBeaconToken, selection.entitySelector.$token)}
			href={null}
			layout={EntityLayout.Value}
		/>

		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$targetNetwork)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>token</dt>
				<dd>
					<BnbBeaconTokenView
						selection={select(EntityType.BnbBeaconToken, selection.entitySelector.$token)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>target network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$targetNetwork)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>target address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.targetAddress} />
				</dd>
			</div>

			<div>
				<dt>migration kind</dt>
				<dd>
					<ResourceBoundary
						resource={bnbBeaconTokenMigration}
					>
						{#snippet children(entity)}
							{entity.migrationKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceAddress = entity.sourceAddress}
					{#if sourceAddress != null}
						<div>
							<dt>source address</dt>
							<dd>
								<TruncatedValue value={sourceAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							targetContractAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const targetContractAddress = entity.targetContractAddress}
					{#if targetContractAddress != null}
						<div>
							<dt>target contract address</dt>
							<dd>
								<TruncatedValue value={targetContractAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amount = entity.amount}
					{#if amount != null}
						<div>
							<dt>amount</dt>
							<dd>
								<NumberValue
									value={amount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							eventTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const eventTxHash = entity.eventTxHash}
					{#if eventTxHash != null}
						<div>
							<dt>event transaction hash</dt>
							<dd>
								<TruncatedValue value={eventTxHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BnbBeaconTokenMigration_TimestampsView
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
