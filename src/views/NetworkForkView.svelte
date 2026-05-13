<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { stringify } from 'devalue'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { ForkScheduleKind } from '$/schema/NetworkFork.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.NetworkFork>
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
			| 'Details'
			| 'Heading'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const forkIdKey = stringify(entityId)
	const chainId = entityId.$network.chainId

	const fork = useEntity(
		EntityType.NetworkFork,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			name: {},
			slug: {},
			activationBlock: {},
			activationEpoch: {},
			activationTimestamp: {},
			kind: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
</script>


<EntityView
	{...entityViewRest}
	entityType={EntityType.NetworkFork}
	{entityId}
	{href}
	{open}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={fork}
			placeholderText="Loading fork…"
		>
			{#snippet children(f)}
				<HeadingComponent>{f.name ?? entityId.forkId}</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.NetworkFork}
			{entityId}
		>
			<ResourceBoundary
				resource={fork}
				placeholderText="Loading fork…"
			>
				{#snippet children(f)}
					<dl>
						{#if f.activationBlock !== undefined}
							<div>
								<dt>Activation block</dt>
								<dd>{String(f.activationBlock)}</dd>
							</div>
						{/if}
						{#if f.activationEpoch !== undefined}
							<div>
								<dt>Activation epoch</dt>
								<dd>{String(f.activationEpoch)}</dd>
							</div>
						{/if}
						{#if f.activationTimestamp !== undefined}
							<div>
								<dt>Activation time</dt>
								<dd>
									<Timestamp
										timestamp={f.activationTimestamp}
										format={TimestampFormat.Absolute}
									/>
								</dd>
							</div>
						{/if}
						{#if f.kind !== undefined}
							<div>
								<dt>Kind</dt>
								<dd>
									{(
										f.kind === ForkScheduleKind.Blob ?
											'Blob schedule (EIP-4844 sidecars)'
										: f.kind === ForkScheduleKind.Execution ?
											'Execution'
										: f.kind === ForkScheduleKind.Consensus ?
											'Consensus'
										:
											f.kind
									)}
								</dd>
							</div>
						{/if}
					</dl>

					{#if f.kind !== ForkScheduleKind.Blob}
						<div
							data-scroll-container="inline layout-carousel carousel-marker-tabs"
							style="--carousel-basis: 40ch; gap: 0.5em"
						>
							<section data-scroll-marker-label="Blocks">
								<EvmBlocksView
									entityFieldReference={{
										entityType: EntityType.Network,
										entityId: { chainId },
										fieldName: '$$blocks',
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(forks)/fork/[forkSlug]/(fork)/blocks',
										{
											networkId: String(chainId),
											forkSlug: (
												f.slug
												?? entityId.forkId
											),
										},
									)}
									id={`${forkIdKey}:blocks`}
								/>
							</section>
							<section data-scroll-marker-label="Transactions">
								<EvmTransactionsView
									entityFieldReference={{
										entityType: EntityType.Network,
										entityId: { chainId },
										fieldName: '$$transactions',
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/transactions',
										{
											networkId: String(chainId),
										},
									)}
									id={`${forkIdKey}:transactions`}
								/>
							</section>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
