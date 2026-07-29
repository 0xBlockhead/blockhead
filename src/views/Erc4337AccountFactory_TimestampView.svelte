<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.Erc4337AccountFactory_Timestamp> = $props()

	const factory = $derived(selection.entitySelector.$factory)
	const erc4337AccountFactoryTimestamp = $derived(selection({
		fields: {
			userOperationsCount: true,
			smartAccountsCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Erc4337AccountFactoryView from '$/views/Erc4337AccountFactoryView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4337AccountFactory_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in factory.$network ?
							caip2StringFromValue(factory.$network.caip2)
						:
							factory.$network.slug
					),
					address: factory.address,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={erc4337AccountFactoryTimestamp}>
			{#snippet children(entity)}
				{@const userOperationsCount = entity.userOperationsCount}
				{#if userOperationsCount != null}
					<NumberValue
						value={userOperationsCount}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={erc4337AccountFactoryTimestamp}>
			{#snippet children(entity)}
				<span data-text="muted">
					{selection.entitySelector.source}
				</span>
				{@const smartAccountsCount = entity.smartAccountsCount}
				{#if smartAccountsCount != null}
					<span data-text="muted">
						<NumberValue
							value={smartAccountsCount}
						/>

						<span> smart accounts</span>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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
				resource={erc4337AccountFactoryTimestamp}
			>
				{#snippet children(entity)}
					{@const userOperationsCount = entity.userOperationsCount}
					{#if userOperationsCount != null}
						<div>
							<dt>User operations</dt>
							<dd>
								<NumberValue
									value={userOperationsCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={erc4337AccountFactoryTimestamp}
			>
				{#snippet children(entity)}
					{@const smartAccountsCount = entity.smartAccountsCount}
					{#if smartAccountsCount != null}
						<div>
							<dt>Smart accounts</dt>
							<dd>
								<NumberValue
									value={smartAccountsCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Factory</dt>
				<dd>
					<Erc4337AccountFactoryView
						selection={select(EntityType.Erc4337AccountFactory, selection.entitySelector.$factory)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
