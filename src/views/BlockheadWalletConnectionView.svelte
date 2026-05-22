<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'

	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		icon,
		accounts,
		chainId,
		status,
		error,
		onRemove,
		entityId,
		title,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			icon?: string
			accounts: `0x${string}`[]
			chainId: number | null
			status: 'connecting' | 'connected' | 'error'
			error: string | null
			onRemove: () => void
			entityId: EntityId<typeof schema, EntityType.BlockheadWalletConnection>
			title: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Icon'
			| 'Content'
			| 'Details'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const walletConnectionKey = $derived(
		stringify(entityId),
	)

	const walletConnection = useEntity(
		EntityType.BlockheadWalletConnection,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			...(open ?
				{
					selected: {},
					connectedAt: {},
				}
				:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import ActorView from '$/views/ActorView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletConnection}
	bind:open
	{entityId}
	{href}
	{title}
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Icon()}
		{#if icon}
			<IconComponent
				src={icon}
				alt={title}
			/>
		{/if}
	{/snippet}

	{#snippet Heading()}
		{title}
	{/snippet}

	{#snippet Title()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			EIP-1193 exposes the wallet’s selected accounts and current chain id to the page; dapps read them when constructing transactions.
		</p>
		<p>
			Those handles are not Farcaster FIDs, on-chain contract labels, or a general-purpose contact book.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column="gap-1">

			<dl data-column-item="center">

				<div>
					<dt>Status</dt>
					<dd>{status}</dd>
				</div>

				{#if accounts[0]}
				<div>
					<dt>Primary account</dt>
					<dd>
						{#if chainId !== null}
							<ActorNetworkView
								entityId={{
									$network: { chainId },
									$actor: {
										address: accounts[0],
									},
								}}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
									{
										networkId: String(chainId),
										address: accounts[0],
									},
								)}
								layout={EntityLayout.Title}
								open={false}
								showTypeAnnotation={false}
							/>
						{:else}
							<ActorView
								entityId={{
									address: accounts[0],
								}}
								href={resolve('/account/[address]', {
									address: accounts[0],
								})}
								layout={EntityLayout.Title}
								open={false}
								showTypeAnnotation={false}
							/>
						{/if}
					</dd>
				</div>
				{/if}

				{#if chainId !== null}
				<div>
					<dt>Chain</dt>
					<dd>{String(chainId)}</dd>
				</div>
				{/if}

				{#if open}
				<ResourceBoundary
					resource={walletConnection}
					placeholderText="Loading wallet connection…"
				>
					{#snippet children(walletConnection)}
						<div>
							<dt>Selected</dt>
							<dd>{walletConnection.selected ? 'Yes' : 'No'}</dd>
						</div>

						<div>
							<dt>Connected at</dt>
							<dd>
								<Timestamp
									timestamp={walletConnection.connectedAt}
									format={TimestampFormat.Both}
								/>
							</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
				{/if}
			</dl>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BlockheadWalletConnection}
			{entityId}
		/>

		{#if error}
			<p
				role="alert"
			>
				{error}
			</p>
		{/if}

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${walletConnectionKey}:carousel-wallet`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>
							Wallet connection
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
					{#if accounts.length}
						<a
							data-scroll-marker-label="Accounts"
							href={`#${walletConnectionKey}:wallet-accounts`}
						>Accounts</a>
					{/if}
					<a
						data-scroll-marker-label="Actions"
						href={`#${walletConnectionKey}:wallet-actions`}
					>Actions</a>
				{/snippet}

				{#snippet body(_childrenContext)}
					{#if accounts.length}
						<section id={`${walletConnectionKey}:wallet-accounts`}>
							<ul
								data-column="gap-1"
								data-list="unstyled"
							>
								{#each accounts as address (address)}
									<li>
										{#if chainId !== null}
											<ActorNetworkView
												entityId={{
													$network: { chainId },
													$actor: { address },
												}}
												href={resolve(
													'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
													{
														networkId: String(chainId),
														address: address,
													},
												)}
											/>
										{:else}
											<ActorView
												entityId={{ address }}
												href={resolve('/account/[address]', {
													address: address,
												})}
											/>
										{/if}
									</li>
								{/each}
							</ul>
						</section>
					{:else}
						<section>
							<p data-text="muted">
								No accounts are connected to this wallet yet.
							</p>
						</section>
					{/if}

					<section id={`${walletConnectionKey}:wallet-actions`}>
						<div data-row>
							<button
								type="button"
								onclick={onRemove}
							>
								Remove
							</button>
						</div>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>

	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
