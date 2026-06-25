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
		'$storageNode',
		'proofId',
		'proofKind',
	],
	content: {
		dl: [
			[
				'$storageNode',
				'proofId',
				'proofKind',
				{
					label: 'verified block',
				},
				'$dataBlob',
				'$consensusNetwork',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Storage node',
				items: [
					{
						label: 'parent public storage node',
					},
				],
			},
			{
				label: 'Data blob',
				items: [
					{
						label: 'linked data-root blob',
					},
				],
			},
			{
				label: 'Consensus',
				items: [
					{
						label: 'linked consensus-network identity',
					},
				],
			},
			{
				label: 'Local proof material',
				items: [
					{
						label: 'Blockhead proof row when a connected node exposes raw bytes/status',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGStorageProof>
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
	entityType={EntityType.ZeroGStorageProof}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
