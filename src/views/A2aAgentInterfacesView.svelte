<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.A2aAgentInterface> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aAgentInterface}
	bind:open
	resource={
		selection({
			...{
				fields: {
					protocolBinding: true,
					url: true,
					transportKind: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: a2aAgentInterface })}
		{@const a2aAgentInterfaceSelector = a2aAgentInterface[EntityMetaKey.Selector]}
		{@const cardSnapshot = a2aAgentInterfaceSelector.$cardSnapshot}
		<EntityView
			entityType={EntityType.A2aAgentInterface}
			entitySelector={a2aAgentInterfaceSelector}
			href={
				resolve(
					'/(agents)/agents/a2a/card/[agentCardUrl=absoluteUrl]/(a2aAgentCard)/snapshot/[contentHashAlgorithm=stringSegment]/[contentHash=zeroExHex]/(a2aAgentCardSnapshot)/interface/[protocolBinding=stringSegment]/[url=absoluteUrl]',
					{
						agentCardUrl: encodeURIComponent(cardSnapshot.$card.agentCardUrl),
						contentHashAlgorithm: cardSnapshot.contentHashAlgorithm,
						contentHash: cardSnapshot.contentHash,
						protocolBinding: a2aAgentInterfaceSelector.protocolBinding,
						url: encodeURIComponent(a2aAgentInterfaceSelector.url),
					}
				)
			}
		>
			{#snippet Title()}
				{a2aAgentInterfaceSelector.protocolBinding || 'A2A agent interface'}
			{/snippet}

			{#snippet Value()}
				{a2aAgentInterfaceSelector.url}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{a2aAgentInterface.transportKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
