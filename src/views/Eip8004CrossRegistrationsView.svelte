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
	}: EntityListViewProps<EntityType.Eip8004CrossRegistration> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Eip8004CrossRegistration}
	bind:open
	resource={
		selection({
			...{
				fields: {
					targetKind: true,
					targetSelectorHash: true,
					targetSelectorHashAlgorithm: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: eip8004CrossRegistration })}
		{@const eip8004CrossRegistrationSelector = eip8004CrossRegistration[EntityMetaKey.Selector]}
		{@const registrationFile = eip8004CrossRegistrationSelector.$registrationFile}
		<EntityView
			entityType={EntityType.Eip8004CrossRegistration}
			entitySelector={eip8004CrossRegistrationSelector}
			href={
				resolve(
					'/(agents)/agents/eip-8004/[namespace=stringSegment]/[chainId=nonNegativeInteger]/registry/[identityRegistry=evmAddress]/agent/[agentId=stringSegment]/(eip8004AgentRegistration)/file/[fileUrl=absoluteUrl]/(eip8004AgentRegistrationFile)/cross-registration/[targetKind=stringSegment]/[targetSelectorHashAlgorithm=stringSegment]/[targetSelectorHash=zeroExHex]',
					{
						namespace: registrationFile.$registration.namespace,
						chainId: String(registrationFile.$registration.chainId),
						identityRegistry: registrationFile.$registration.identityRegistry,
						agentId: registrationFile.$registration.agentId,
						fileUrl: encodeURIComponent(registrationFile.fileUrl),
						targetKind: eip8004CrossRegistrationSelector.targetKind,
						targetSelectorHashAlgorithm: eip8004CrossRegistrationSelector.targetSelectorHashAlgorithm,
						targetSelectorHash: eip8004CrossRegistrationSelector.targetSelectorHash,
					}
				)
			}
		>
			{#snippet Title()}
				{eip8004CrossRegistrationSelector.targetKind || 'EIP-8004 cross registration'}
			{/snippet}

			{#snippet Value()}
				{eip8004CrossRegistrationSelector.targetSelectorHash}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{eip8004CrossRegistrationSelector.targetSelectorHashAlgorithm}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
