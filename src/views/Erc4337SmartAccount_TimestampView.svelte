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
	}: EntitySelectionViewProps<EntityType.Erc4337SmartAccount_Timestamp> = $props()

	const account = $derived(selection.entitySelector.$account)
	const erc4337SmartAccountTimestamp = $derived(selection({
		fields: {
			userOperationsCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import Erc4337SmartAccountView from '$/views/Erc4337SmartAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4337SmartAccount_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]/(erc4337SmartAccount)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in account.$network ?
							caip2StringFromValue(account.$network.caip2)
						:
							account.$network.slug
					),
					address: account.address,
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
		<ResourceBoundary resource={erc4337SmartAccountTimestamp}>
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
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
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
				resource={erc4337SmartAccountTimestamp}
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
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Smart account</dt>
				<dd>
					<Erc4337SmartAccountView
						selection={select(EntityType.Erc4337SmartAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
