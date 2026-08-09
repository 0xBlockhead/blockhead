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
			...{
				fields: {
					version: true,
					$program: {
						fields: {
							label: true,
							packageName: true,
							registryAgentId: true,
							repositoryUrl: true,
						},
					},
					$artifact: {
						fields: {
							artifactType: true,
							mediaType: true,
							providerArtifactId: true,
							ociDigest: true,
							ipfsCid: true,
							arweaveId: true,
							gitObject: true,
							digest: true,
							size: true,
						},
					},
					distributionKind: true,
				},
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
				'version' in acpAgentProgramVersionSelector
				&& '$program' in acpAgentProgramVersionSelector
				&& 'registryAgentId' in acpAgentProgramVersionSelector.$program ?
					resolve(
						'/(agents)/agents/acp/program/registry/[registryAgentId=stringSegment]/(acpAgentProgram)/version/[version=stringSegment]',
						{
							registryAgentId: acpAgentProgramVersionSelector.$program.registryAgentId,
							version: acpAgentProgramVersionSelector.version,
						}
					)
				:
					'$artifact' in acpAgentProgramVersionSelector
					&& 'digestAlgorithm' in artifact
					&& 'digest' in artifact ?
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
				{acpAgentProgramVersion.version || (acpAgentProgramVersion.$artifact.artifactType ?? '') || [acpAgentProgramVersion.$artifact.providerArtifactId, acpAgentProgramVersion.$artifact.ociDigest, acpAgentProgramVersion.$artifact.ipfsCid, acpAgentProgramVersion.$artifact.arweaveId, acpAgentProgramVersion.$artifact.gitObject, acpAgentProgramVersion.$artifact.digest].filter(Boolean).join(' ') || 'AI artifact'}
			{/snippet}

			{#snippet Value()}
				{(acpAgentProgramVersion.$program.label ?? '') || [acpAgentProgramVersion.$program.registryAgentId, acpAgentProgramVersion.$program.packageName, acpAgentProgramVersion.$program.repositoryUrl].filter(Boolean).join(' ') || 'ACP agent program'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{acpAgentProgramVersion.distributionKind ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
