<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/channels'),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.StateChannelDeposit>
			href?: string
			layout?: EntityLayout
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	const deposit = $derived(selection(
		({ sources: [Source.Local_Internal], fields: { availableBalance: true, lockedBalance: true, lastUpdated: true, $account: true, $network: true } }),
	))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.StateChannelDeposit}
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selection.entitySelector.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Deposit </span>
			<ResourceBoundary
				resource={deposit}
				placeholderText="…"
			>
				{#snippet children(deposit)}
					{#if deposit.fields.$account?.[EntityMetaKey.Selector].address !== undefined}
						<EvmAccountView
							selection={select(EntityType.EvmAccount, deposit.fields.$account[EntityMetaKey.Selector])}
							href={`/account/${deposit.fields.$account[EntityMetaKey.Selector].address}`}
							layout={EntityLayout.Value}

						/>
					{:else}
						{#if Value}
						{@render Value()}
					{/if}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Per-participant collateral slice tracked for channel funding and dispute reserves.
		</p>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={deposit}
				placeholderText="Loading channel deposit…"
			>
				{#snippet children(deposit)}
					{#if deposit.fields.$account?.[EntityMetaKey.Selector].address !== undefined}
						<div>
							<dt>Account</dt>
							<dd>
								{#if deposit.fields.$network !== undefined}
									<EvmNetworkAccountView
										selection={select(EntityType.EvmNetworkAccount, {
											$network: deposit.fields.$network[EntityMetaKey.Selector],
											$actor: deposit.fields.$account[EntityMetaKey.Selector],
										})}
										layout={EntityLayout.Title}

									/>
								{:else}
									<EvmAccountView
										selection={select(EntityType.EvmAccount, deposit.fields.$account[EntityMetaKey.Selector])}
										href={`/account/${deposit.fields.$account[EntityMetaKey.Selector].address}`}
										layout={EntityLayout.Title}

									/>
								{/if}
							</dd>
						</div>
					{/if}

					{#if deposit.fields.availableBalance !== undefined}
						<div>
							<dt>Available</dt>
							<dd>
								<NumberValue value={deposit.fields.availableBalance} />
							</dd>
						</div>
					{/if}

					{#if deposit.fields.lockedBalance !== undefined}
						<div>
							<dt>Locked</dt>
							<dd>
								<NumberValue value={deposit.fields.lockedBalance} />
							</dd>
						</div>
					{/if}

					{#if deposit.fields.lastUpdated !== undefined}
						<div>
							<dt>Last updated</dt>
							<dd>
								<Timestamp
									timestamp={deposit.fields.lastUpdated}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
