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
				label: 'Dogecoin block',
			},
			{
				label: 'parent block header ref',
			},
			{
				label: 'coinbase branch ref',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'Dogecoin block',
					},
					{
						label: 'parent block header ref',
					},
					{
						label: 'coinbase branch ref',
					},
					{
						label: 'chain branch ref',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Block',
					items: [
						{
							label: 'parent Dogecoin UTXO block',
						},
					],
				},
				{
					label: 'Parent header',
					items: [
						{
							label: 'merged-mining parent header evidence',
						},
					],
				},
				{
					label: 'Merkle branches',
					items: [
						{
							label: 'coinbase branch',
						},
						{
							label: 'chain branch',
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
			selection: EntityProxyResource<typeof schema, EntityType.DogecoinBlockAuxPow>
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
	entityType={EntityType.DogecoinBlockAuxPow}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
