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
				label: 'contract',
			},
			{
				label: 'block number',
			},
			'source',
		],
		content: {
			dl: [
				[
					{
						label: 'contract',
					},
					{
						label: 'block number',
					},
					'source',
					'nonce',
					{
						label: 'class hash',
					},
					{
						label: 'found state',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Contract',
					items: [
						{
							label: 'parent Starknet contract',
						},
					],
				},
				{
					label: 'Class',
					items: [
						{
							label: 'Starknet class when classHash resolves',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'starknet_getNonce',
						},
						{
							label: 'starknet_getClassHashAt',
						},
						{
							label: 'indexer account payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetAccount_Timestamp>
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
	entityType={EntityType.StarknetAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
