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
		'$subnet',
		{
			label: 'observed time/source',
		},
		'nodeCount',
	],
	content: {
		dl: [
			[
				'$subnet',
				{
					label: 'observed time/source',
				},
				'subnetKind',
				'publicKey',
				'nodeCount',
			],
			[
				'canisterCount',
				'replicaVersion',
				'certifiedHeight',
				'stateRootHash',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Subnet',
				items: [
					{
						label: 'parent ICP subnet',
					},
				],
			},
			{
				label: 'Node/replica state',
				items: [
					'nodeCount',
					'replicaVersion',
				],
			},
			{
				label: 'Certification',
				items: [
					'publicKey',
					'certifiedHeight',
					'stateRootHash',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw registry/status payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpSubnet_Timestamp>
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
	entityType={EntityType.IcpSubnet_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
