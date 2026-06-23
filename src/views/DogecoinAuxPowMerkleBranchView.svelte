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
				label: 'AuxPoW ref',
			},
			{
				label: 'branch kind',
			},
			{
				label: 'branch hash count',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'AuxPoW ref',
					},
					{
						label: 'branch kind',
					},
					{
						label: 'branch hash count',
					},
					'index',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Hashes',
					items: [
						{
							label: 'ordered branch hash list',
						},
					],
				},
				{
					label: 'AuxPoW',
					items: [
						{
							label: 'parent Dogecoin AuxPoW proof',
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
			selection: EntityProxyResource<typeof schema, EntityType.DogecoinAuxPowMerkleBranch>
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
	entityType={EntityType.DogecoinAuxPowMerkleBranch}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
