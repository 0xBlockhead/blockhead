<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { consensusProtocols } from '$/constants/Network.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(upgrades)/upgrade/[upgradeSlug]',
			{
				networkId: String(entityId.$network.chainId),
				upgradeSlug: entityId.upgradeId,
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NetworkConsensusUpgrade>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const networkConsensusUpgrade = useEntity(
		EntityType.NetworkConsensusUpgrade,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			slug: {},
			...(open && {
				protocol: {},
				previousForkVersion: {
					$: [
						Source.Beacon_Rest,
					],
				},
				currentForkVersion: {
					$: [
						Source.Beacon_Rest,
					],
				},
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import ProposalsView from '$/views/ProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.NetworkConsensusUpgrade}
	{entityId}
	href={href}
	bind:open
	title={`Consensus upgrade ${entityId.upgradeId}`}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.upgradeId}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={networkConsensusUpgrade}
			placeholderText="Loading consensus upgrade…"
		>
			{#snippet children(loadedNetworkConsensusUpgrade)}
				{loadedNetworkConsensusUpgrade.name ?? entityId.upgradeId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			{#if (
				contentOpen
				&& networkConsensusUpgrade.protocol !== undefined
			)}
				<div>
					<dt>Consensus fork</dt>
					<dd>
						<ResourceBoundary
							resource={networkConsensusUpgrade}
							placeholderText="Loading consensus upgrade…"
						>
							{#snippet children(loadedNetworkConsensusUpgrade)}
								{consensusProtocols[loadedNetworkConsensusUpgrade.protocol].label}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen && loadedNetworkConsensusUpgrade.previousForkVersion !== undefined}
				<div>
					<dt>Previous fork version</dt>
					<dd>
						<ResourceBoundary
							resource={networkConsensusUpgrade}
							placeholderText="Loading consensus upgrade…"
						>
							{#snippet children(loadedNetworkConsensusUpgrade)}
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									value={loadedNetworkConsensusUpgrade.previousForkVersion}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen && loadedNetworkConsensusUpgrade.currentForkVersion !== undefined}
				<div>
					<dt>Current fork version</dt>
					<dd>
						<ResourceBoundary
							resource={networkConsensusUpgrade}
							placeholderText="Loading consensus upgrade…"
						>
							{#snippet children(loadedNetworkConsensusUpgrade)}
								<TruncatedValue
									format={TruncatedValueFormat.Abbr}
									value={loadedNetworkConsensusUpgrade.currentForkVersion}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.NetworkConsensusUpgrade}
			{entityId}
		/>
		<ProposalsView
			href={resolve('/proposals')}
			entityFieldReference={{
				entityType: EntityType.NetworkConsensusUpgrade,
				entityId,
				fieldName: '$$proposals',
			}}
			id={`${stringify(entityId)}:proposals`}
			open={false}
			title="Specification proposals"
		/>
	{/snippet}
</EntityView>
