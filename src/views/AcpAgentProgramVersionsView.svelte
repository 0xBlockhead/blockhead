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
	}: EntityListViewProps<EntityType.AcpAgentProgramVersion> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AcpAgentProgramVersion}
	bind:open
	resource={
		selection({
			fields: {
				version: true,
				$program: true,
				$artifact: true,
				distributionKind: true,
			},
		})
	}
>
	{#snippet Item({ item: acpAgentProgramVersion })}
		{@const acpAgentProgramVersionSelector = acpAgentProgramVersion[EntityMetaKey.Selector]}
		{@const artifact = acpAgentProgramVersionSelector.$artifact}
		<EntityView
			entityType={EntityType.AcpAgentProgramVersion}
			entitySelector={acpAgentProgramVersionSelector}
			href={
				acpAgentProgramVersionSelector.version !== undefined
				&& acpAgentProgramVersionSelector.$program !== undefined
				&& acpAgentProgramVersionSelector.$program.registryAgentId !== undefined ?
					resolve(
						'/(agents)/agents/acp/program/registry/[registryAgentId=stringSegment]/(acpAgentProgram)/version/[version=stringSegment]',
						{
							registryAgentId: acpAgentProgramVersionSelector.$program.registryAgentId,
							version: acpAgentProgramVersionSelector.version,
						}
					)
				:
					artifact !== undefined
					&& artifact.digestAlgorithm !== undefined
					&& artifact.digest !== undefined ?
						resolve(
							'/(ai)/ai/artifact/digest/[digestAlgorithm=stringSegment]/[digest=zeroExHex]/(aiArtifact)/acp-program-version',
							{
								digestAlgorithm: artifact.digestAlgorithm,
								digest: artifact.digest,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{(acpAgentProgramVersion.version ?? '') || (acpAgentProgramVersion.$artifact == null ? '' : (acpAgentProgramVersion.$artifact.artifactType ?? '') || [(acpAgentProgramVersion.$artifact.providerArtifactId ?? ''), (acpAgentProgramVersion.$artifact.ociDigest ?? ''), (acpAgentProgramVersion.$artifact.ipfsCid ?? ''), (acpAgentProgramVersion.$artifact.arweaveId ?? ''), (acpAgentProgramVersion.$artifact.gitObject ?? ''), (acpAgentProgramVersion.$artifact.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact') || 'ACP agent program version'}
			{/snippet}

			{#snippet Value()}
				{acpAgentProgramVersion.$program == null ? '' : (acpAgentProgramVersion.$program.label ?? '') || [(acpAgentProgramVersion.$program.registryAgentId ?? ''), (acpAgentProgramVersion.$program.packageName ?? ''), (acpAgentProgramVersion.$program.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'ACP agent program'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpAgentProgramVersion.distributionKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
