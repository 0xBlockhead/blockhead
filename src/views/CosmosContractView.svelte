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
		'$network',
		{
			label: 'contract address',
		},
		'codeId',
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'contract address',
				},
				'codeId',
				'$creator',
				'$admin',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Creator',
				items: [
					{
						label: 'creator Cosmos account',
					},
				],
			},
			{
				label: 'Admin',
				items: [
					{
						label: 'admin Cosmos account',
					},
				],
			},
			{
				label: 'Messages',
				items: [
					{
						label: 'Cosmos messages when contract messages are resolved',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Cosmos network',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosContract>
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
	entityType={EntityType.CosmosContract}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
