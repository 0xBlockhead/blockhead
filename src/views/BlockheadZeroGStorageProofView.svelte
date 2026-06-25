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
		'$nodeState',
		'proofId',
		'proofKind',
	],
	content: {
		dl: [
			[
				'$nodeState',
				'proofId',
				'proofKind',
				'$dataBlob',
				'$chunk',
			],
			[
				'verified',
				{
					label: 'verified time',
				},
				{
					label: 'verified block',
				},
				'error',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Proof material',
				items: [
					{
						label: 'redacted proof bytes/status',
					},
				],
			},
			{
				label: 'Data blob',
				items: [
					{
						label: 'linked public data-root blob',
					},
				],
			},
			{
				label: 'Local chunk',
				items: [
					{
						label: 'connected-node stored chunk',
					},
				],
			},
			{
				label: 'Public commitment',
				items: [
					{
						label: 'public storage-proof row when available',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZeroGStorageProof>
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
	entityType={EntityType.BlockheadZeroGStorageProof}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
