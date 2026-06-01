<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { evmChainIdFromNetworkId } from '$/lib/caip.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	const pathNativeCoin = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as const

	let {
		entityId,
		href = resolve(
			'/~/(accounts)/accounts/(allowances)/allowance/[chainId]/[owner]/[coin]/[spender]',
			{
				chainId: String(evmChainIdFromNetworkId(entityId.$actorCoin.$coinInstance.$network)),
				owner: entityId.$actorCoin.$actor.address,
				coin: (
					entityId.$actorCoin.$coinInstance.type === CoinInstanceType.Erc20Token ?
						entityId.$actorCoin.$coinInstance.$contract.address
					:
						pathNativeCoin
				),
				spender: entityId.$spender.address,
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmActorCoinAllowance>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const allowanceAnchorKey = stringify(entityId)

	const allowance = useEntity(
		EntityType.EvmActorCoinAllowance,
		entityId,
		{
			$: [Source.Voltaire_JsonRpc],
			allowance: {},
			lastChecked: {},
			...(open ? { $spenderContract: {} }
			:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
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
	{entityId}
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
				{allowance.allowance !== undefined ? String(allowance.allowance)
				:
					'Allowance'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={allowance}
			placeholderText="Loading allowance…"
		>
			{#snippet children(allowance)}
				{allowance.allowance !== undefined ? String(allowance.allowance)
				:
					'Allowance'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Owner</dt>
				<dd>
					<EvmNetworkAccountView
						entityId={{
							$network: entityId.$actorCoin.$coinInstance.$network,
							$actor: entityId.$actorCoin.$actor,
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
						value={entityId.$spender.address}
					/>
				</dd>
			</div>
			<div>
				<dt>Asset</dt>
				<dd>
					{#if entityId.$actorCoin.$coinInstance.type === CoinInstanceType.NativeCurrency}
						Native gas token (chain issuance)
					{:else if entityId.$actorCoin.$coinInstance.type === CoinInstanceType.Erc20Token}
						<EvmContractView
							entityId={entityId.$actorCoin.$coinInstance.$contract}
							layout={EntityLayout.SummaryDetails}
							open={false}
							showTypeAnnotation={false}
						/>
					{:else}
						—
					{/if}
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Allowance</dt>
					<dd>
						<ResourceBoundary
							resource={allowance}
							placeholderText="Loading allowance…"
						>
							{#snippet children(allowance)}
								{#if allowance.allowance !== undefined}
									{String(allowance.allowance)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Last checked</dt>
					<dd>
						<ResourceBoundary
							resource={allowance}
							placeholderText="Loading allowance…"
						>
							{#snippet children(allowance)}
								{#if allowance.lastChecked !== undefined}
									<Timestamp timestamp={allowance.lastChecked} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Spender contract</dt>
					<dd>
						<ResourceBoundary
							resource={allowance}
							placeholderText="Loading spender…"
						>
							{#snippet children(allowance)}
								{#if allowance.$spenderContract?.[EntityMetaKey.Id]}
									<EvmContractView
										entityId={allowance.$spenderContract[EntityMetaKey.Id]}
										layout={EntityLayout.SummaryDetails}
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
								allowance.allowance == null
								&& allowance.lastChecked == null
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
