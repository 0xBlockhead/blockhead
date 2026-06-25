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
		'$auxPow',
		{
			label: 'parent header hash',
		},
		'merkleRoot',
	],
	content: {
		dl: [
			[
				'$auxPow',
				{
					label: 'parent header hash',
				},
				'merkleRoot',
				'nonce',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'AuxPoW',
				items: [
					{
						label: 'parent Dogecoin AuxPoW proof',
					},
				],
			},
			{
				label: 'Header evidence',
				items: [
					{
						label: 'parent hash',
					},
					'merkleRoot',
					'nonce',
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
			selection: EntityProxyResource<typeof schema, EntityType.DogecoinAuxPowParentBlockHeader>
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
	entityType={EntityType.DogecoinAuxPowParentBlockHeader}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
