<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AcpAgentRuntime> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpAgentRuntime}
	bind:open
	resource={
		selection({
			fields: {
				runtimeId: true,
				$programVersion: true,
				transportKind: true,
			},
		})
	}
>
	{#snippet Item({ item: acpAgentRuntime })}
		{@const acpAgentRuntimeSelector = acpAgentRuntime[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AcpAgentRuntime}
			entitySelector={acpAgentRuntimeSelector}
		>
			{#snippet Title()}
				{acpAgentRuntimeSelector.runtimeId || 'ACP agent runtime'}
			{/snippet}

			{#snippet Value()}
				{acpAgentRuntime.$programVersion == null ? '' : (acpAgentRuntime.$programVersion.version ?? '') || (acpAgentRuntime.$programVersion.$artifact == null ? '' : (acpAgentRuntime.$programVersion.$artifact.artifactType ?? '') || [(acpAgentRuntime.$programVersion.$artifact.providerArtifactId ?? ''), (acpAgentRuntime.$programVersion.$artifact.ociDigest ?? ''), (acpAgentRuntime.$programVersion.$artifact.ipfsCid ?? ''), (acpAgentRuntime.$programVersion.$artifact.arweaveId ?? ''), (acpAgentRuntime.$programVersion.$artifact.gitObject ?? ''), (acpAgentRuntime.$programVersion.$artifact.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact') || 'ACP agent program version'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpAgentRuntime.transportKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
