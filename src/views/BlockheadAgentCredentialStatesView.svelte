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
	}: EntityListViewProps<EntityType.BlockheadAgentCredentialState> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentCredentialState}
	bind:open
	resource={
		selection({
			...{
				fields: {
					label: true,
					credentialKind: true,
					credentialId: true,
					$connection: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadAgentCredentialState })}
		{@const blockheadAgentCredentialStateSelector = blockheadAgentCredentialState[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAgentCredentialState}
			entitySelector={blockheadAgentCredentialStateSelector}
			href={
				resolve(
					'/~/agent/credential/[credentialId=stringSegment]',
					{
						credentialId: blockheadAgentCredentialStateSelector.credentialId,
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadAgentCredentialState.label ?? '') || blockheadAgentCredentialStateSelector.credentialId || 'blockhead agent credential state'}
			{/snippet}

			{#snippet Value()}
				{blockheadAgentCredentialState.credentialKind ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadAgentCredentialState.$connection == null ? '' : blockheadAgentCredentialState.$connection.connectionId || 'blockhead agent connection'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
