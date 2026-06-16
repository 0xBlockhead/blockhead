<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selector,
		href,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	import { subscribe } from '$/routes/+layout.svelte'
	import { formatValue } from '$/lib/number.ts'

	const actorCoinDetailAnchorKey = $derived(stringify(selector))

	const actorCoin = $derived(subscribe(EntityType.EvmNetworkActorCoinBalance,
		selector,
		({ sources: [Source.Allium_Rest], fields: { symbol: true, balance: true, $coinInstance: true, ...(open ? ({ decimals: true, usdValue: true }) : ({  })) } }),
	))


	// (Derived)
	const formattedBalance = $derived.by(() => {
		const currentActorCoin = actorCoin.current

		if (currentActorCoin?.fields.balance == null)
			return undefined

		if (currentActorCoin.fields.decimals == null || currentActorCoin.fields.decimals <= 0)
			return formatValue(Number(currentActorCoin.fields.balance))

		const divisor = 10n ** BigInt(currentActorCoin.fields.decimals)
		const integerPart = currentActorCoin.fields.balance / divisor
		const fractionalPart = currentActorCoin.fields.balance % divisor
		const fractionalPartString = String(fractionalPart).padStart(currentActorCoin.fields.decimals, '0').replace(/0+$/, '')

		return (
			fractionalPartString ?
				`${formatValue(Number(integerPart))}.${fractionalPartString}`
			:
				formatValue(Number(integerPart))
		)
	})


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkActorCoinBalance}
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={actorCoin}
			placeholderText="Loading balance…"
		>
			{#snippet children(actorCoin)}
				{formattedBalance ?? '—'}
				{actorCoin.fields.symbol ?? ''}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={actorCoin}
			placeholderText="Loading holding…"
		>
			{#snippet children(actorCoin)}
				{formattedBalance ?? '—'}
				{actorCoin.fields.symbol ?? ''}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({
		open: contentOpen,
	})}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<ResourceBoundary
						resource={actorCoin}
						placeholderText="Loading account…"
					>
						{#snippet children(actorCoin)}
							{#if actorCoin.fields.$coinInstance}
								<EvmNetworkAccountView
									selector={{
										$network: actorCoin.fields.$coinInstance[EntityMetaKey.Selector].$network,
										$actor: selector.$actor,
									}}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>Asset</dt>
				<dd>
					<ResourceBoundary
						resource={actorCoin}
						placeholderText="Loading asset…"
					>
						{#snippet children(actorCoin)}
							{#if actorCoin.fields.$coinInstance?.[EntityMetaKey.Selector].type === CoinInstanceType.NativeCurrency}
								Native gas token (chain issuance)
							{:else if actorCoin.fields.$coinInstance?.$contract}
								<EvmContractView
									selector={actorCoin.fields.$coinInstance.$contract[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							{:else}
								—
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Balance</dt>
					<dd>
						<ResourceBoundary
							resource={actorCoin}
							placeholderText="Loading balance…"
						>
							{#snippet children(actorCoin)}
								{#if actorCoin.fields.balance !== undefined}
									{formattedBalance}
									{actorCoin.fields.symbol ?? ''}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>USD value</dt>
					<dd>
						<ResourceBoundary
							resource={actorCoin}
							placeholderText="Loading balance…"
						>
							{#snippet children(actorCoin)}
								{#if actorCoin.fields.usdValue !== undefined}
									{String(actorCoin.fields.usdValue)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Decimals</dt>
					<dd>
						<ResourceBoundary
							resource={actorCoin}
							placeholderText="Loading balance…"
						>
							{#snippet children(actorCoin)}
								{#if actorCoin.fields.decimals !== undefined}
									{String(actorCoin.fields.decimals)}
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
			id={`${actorCoinDetailAnchorKey}:carousel-related`}
			sectionIdPrefix={actorCoinDetailAnchorKey}
			sections={[
				{ id: 'coin-overview', label: 'Overview' },
			]}
			data-card
		>
			{#snippet Summary({ open: _relatedSummaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Holding detail
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCoinOverview({ id, label })}
				<ResourceBoundary
					resource={actorCoin}
					placeholderText="Loading holding…"
				>
					{#snippet children(actorCoin)}
						{#if (
							actorCoin.fields.symbol == null
							&& actorCoin.fields.decimals == null
							&& actorCoin.fields.balance == null
						)}
							<div data-row="wrap align-center gap-2">
								<p data-text="muted">
									No balance yet.
								</p>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Symbol, decimals, and balance appear once this holding is resolved for the wallet on this network.
										</p>
									{/snippet}
									<abbr
										class="entity-heading-tip"
										aria-label="Token balance"
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
