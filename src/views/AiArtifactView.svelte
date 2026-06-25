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
		{
			label: 'artifact selector',
		},
		{
			label: 'media/artifact type',
		},
		'size',
	],
	content: {
		dl: [
			[
				{
					label: 'digest/CID/OCI/git selector',
				},
				'uri',
				'mediaType',
				'artifactType',
				'size',
			],
			[
				{
					label: 'config/layer/subject descriptors',
				},
				{
					label: 'document refs',
				},
				{
					label: 'attestation refs',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Documents',
				items: [
					{
						label: 'AiDocument list',
					},
				],
			},
			{
				label: 'Attestations',
				items: [
					{
						label: 'AiArtifactAttestation list',
					},
				],
			},
			{
				label: 'Content addressing',
				items: [
					'digest',
					'ociDigest',
					'ipfsCid',
					'arweaveId',
					'gitObject',
				],
			},
			{
				label: 'OCI',
				items: [
					{
						label: 'config/layer/subject descriptors',
					},
					'annotations',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'source-specific artifact locator',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'documents',
			label: 'documents',
			field: '$$documents',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'attestations',
			label: 'attestations',
			field: '$$attestations',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AiArtifact>
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
	entityType={EntityType.AiArtifact}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
