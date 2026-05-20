<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import { stringify } from 'devalue'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.NetworkConsensusUpgrade>
			href?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Content'
			| 'Details'
			| 'Heading'
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
			}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ProposalsView from '$/views/ProposalsView.svelte'
</script>


<EntityView
	entityType={EntityType.NetworkConsensusUpgrade}
	{entityId}
	{href}
	bind:open
	title={`Consensus upgrade · ${entityId.upgradeId}`}
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Title()}
		<span data-text="font-monospace">
			{entityId.upgradeId}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={networkConsensusUpgrade}
			placeholderText="Loading consensus upgrade…"
		>
			{#snippet children(networkConsensusUpgrade)}
				{networkConsensusUpgrade.name ?? entityId.upgradeId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={networkConsensusUpgrade}
			placeholderText="Loading consensus upgrade…"
		>
			{#snippet children(networkConsensusUpgrade)}
				<dl data-column-item="center">
					{#if open}
						{#if networkConsensusUpgrade.protocol !== undefined}
							<div>
								<dt>Consensus fork</dt>
								<dd>{networkConsensusUpgrade.protocol}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.NetworkConsensusUpgrade}
			{entityId}
		/>

		<ProposalsView
			entityFieldReference={{
				entityType: EntityType.NetworkConsensusUpgrade,
				entityId,
				fieldName: '$$proposals',
			}}
			id={`${stringify(entityId)}:proposals`}
			open={false}
			title="Specification proposals"
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
