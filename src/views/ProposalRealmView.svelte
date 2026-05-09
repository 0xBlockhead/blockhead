<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import { proposalRealmById } from '$/constants/Proposal.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
	}: {
		children?: Snippet
		entityId: EntityId<typeof schema, EntityType.ProposalRealm>
		open?: boolean
		href: string
		layout?: EntityLayout
	} = $props()


	const realmIdKey = $derived(
		stringify(entityId),
	)

	const realmQuery = useEntity(
		EntityType.ProposalRealm,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			label: {},
		},
	)

	const realmLabel = $derived.by(() => {
		return realmQuery.data?.[EntityMetaKey.Fields]?.label ?? proposalRealmById[entityId.realm].label
	})


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ProposalKindsView from '$/views/ProposalKindsView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.ProposalRealm}
	{entityId}
	{href}
	title={realmLabel}
	{layout}
	{open}
>
	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.ProposalRealm}
			{entityId}
		>
			<QueryBoundary query={realmQuery}>
				{#snippet children(_rows)}
					<ProposalKindsView
						entityFieldReference={{
							entityType: EntityType.ProposalRealm,
							entityId,
							fieldName: '$$proposalKinds',
						}}
						href={href}
						id={`${realmIdKey}:proposalKinds`}
						open={false}
						title="Kinds"
					/>
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>

