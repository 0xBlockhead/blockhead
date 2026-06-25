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
		'$canister',
		'certificateHash',
		'pathHash',
	],
	content: {
		dl: [
			[
				'$canister',
				'certificateHash',
				'pathHash',
				'treeHash',
				{
					label: 'certified time',
				},
				'verificationStatus',
				{
					label: 'value presence',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Canister',
				items: [
					{
						label: 'parent ICP canister',
					},
				],
			},
			{
				label: 'Decoded value',
				items: [
					{
						label: 'certified value preview',
					},
				],
			},
			{
				label: 'Witness path',
				items: [
					{
						label: 'hash-tree path',
					},
					'treeHash',
				],
			},
			{
				label: 'Signature chain',
				items: [
					{
						label: 'subnet delegation',
					},
					{
						label: 'root-key verification',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'raw certificate',
					},
					{
						label: 'witness payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpCertifiedState>
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
	entityType={EntityType.IcpCertifiedState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
