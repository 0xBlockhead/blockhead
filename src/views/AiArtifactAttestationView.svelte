<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	closed: [
		'$artifact',
		'attestationKind',
		{
			label: 'log/signature id',
		},
	],
	content: {
		dl: [
			[
				'$artifact',
				'attestationKind',
				{
					label: 'log entry/signature',
				},
			],
			[
				'certificateIdentity',
				{
					label: 'issuer',
				},
				'logIndex',
				'integratedTime',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Artifact',
				items: [
					{
						label: 'AiArtifact',
					},
				],
			},
			{
				label: 'Bundle',
				items: [
					{
						label: 'Sigstore/Rekor bundle',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'attestation payload',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AiArtifactAttestation>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.AiArtifactAttestation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
