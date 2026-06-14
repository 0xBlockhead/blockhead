<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'

	const pathNativeCoin = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as const


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/~/(accounts)/accounts/(allowances)/allowance/[chainId]/[owner]/[coin]/[spender]',
			{
				chainId: String(evmChainIdFromCaip2(`${selector.$actorCoin.$coinInstance.$network.caip2.namespace}:${selector.$actorCoin.$coinInstance.$network.caip2.reference}`)),
				owner: selector.$actorCoin.$actor.address,
				coin: (
					selector.$actorCoin.$coinInstance.type === CoinInstanceType.Erc20Token ?
						selector.$actorCoin.$coinInstance.$contract.address
					:
						pathNativeCoin
				),
				spender: selector.$spender.address,
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmActorCoinAllowance>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { subscribe } from '$/routes/+layout.svelte'

	const allowanceAnchorKey = stringify(selector)

	const allowance = subscribe(EntityType.EvmActorCoinAllowance,
		selector,
		({ sources: [Source.Voltaire_JsonRpc], fields: { allowance: true, lastChecked: true, ...(open ? ({ $spenderContract: true }) : ({  })) } }),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmActorCoinAllowance}
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={allowance}
			placeholderText="Loading allowance…"
		>
			{#snippet children(allowance)}
				{allowance.fields.allowance !== undefined ? String(allowance.fields.allowance) : 'Allowance'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={allowance}
			placeholderText="Loading allowance…"
		>
			{#snippet children(allowance)}
				{allowance.fields.allowance !== undefined ? String(allowance.fields.allowance) : 'Allowance'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open })}
		<dl data-column-item="center">
			<div>
				<dt>Owner</dt>
				<dd>
					<EvmNetworkAccountView
						selector={{
							$network: selector.$actorCoin.$coinInstance.$network,
							$actor: selector.$actorCoin.$actor,
						}}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
			<div>
				<dt>Spender</dt>
				<dd>
					<TruncatedValue
						format={TruncatedValueFormat.Visual}
						value={selector.$spender.address}
					/>
				</dd>
			</div>
			<div>
				<dt>Asset</dt>
				<dd>
					{#if selector.$actorCoin.$coinInstance.type === CoinInstanceType.NativeCurrency}
						Native gas token (chain issuance)
					{:else if selector.$actorCoin.$coinInstance.type === CoinInstanceType.Erc20Token}
						<EvmContractView
							selector={selector.$actorCoin.$coinInstance.$contract}
							layout={EntityLayout.Value}
							open={false}
							showTypeAnnotation={false}
						/>
					{:else}
						—
					{/if}
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Allowance</dt>
					<dd>
						<ResourceBoundary
							resource={allowance}
							placeholderText="Loading allowance…"
						>
							{#snippet children(allowance)}
								{#if allowance.fields.allowance !== undefined}
									{String(allowance.fields.allowance)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Last checked</dt>
					<dd>
						<ResourceBoundary
							resource={allowance}
							placeholderText="Loading allowance…"
						>
							{#snippet children(allowance)}
								{#if allowance.fields.lastChecked !== undefined}
									<Timestamp timestamp={allowance.fields.lastChecked} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Spender contract</dt>
					<dd>
						<ResourceBoundary
							resource={allowance}
							placeholderText="Loading spender…"
						>
							{#snippet children(allowance)}
								{#if allowance.fields.$spenderContract?.[EntityMetaKey.Selector]}
									<EvmContractView
										selector={allowance.fields.$spenderContract[EntityMetaKey.Selector]}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
									/>
								{:else}
									<span data-text="muted">
										Spender is not a known contract on this network.
									</span>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			id={`${allowanceAnchorKey}:carousel-related`}
			sectionIdPrefix={allowanceAnchorKey}
			sections={[
				{ id: 'allowance-overview', label: 'Overview' },
			]}
			data-card
		>
			{#snippet Summary({ open: _relatedSummaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Allowance detail
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAllowanceOverview({ id, label })}
				<ResourceBoundary
					resource={allowance}
					placeholderText="Loading allowance…"
				>
					{#snippet children(allowance)}
						{#if (
							allowance.fields.allowance == null
							&& allowance.fields.lastChecked == null
						)}
							<div data-row="wrap align-center gap-2">
								<p data-text="muted">
									Allowance not yet resolved. Check the token-spender pair on-chain via execution RPC.
								</p>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											ERC-20 allowance is read by calling <code>allowance(owner, spender)</code>
											on the token contract. The spender address must be known; explorers do not index historical Approval events.
										</p>
									{/snippet}
									<abbr
										class="entity-heading-tip"
										aria-label="ERC-20 allowance"
									>ⓘ</abbr>
								</Tooltip>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
