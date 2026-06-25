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
		'stashAccountId',
		{
			label: 'latest era controller/commission/stake summary',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'stashAccountId',
				{
					label: 'latest era controller/commission/stake summary',
				},
				'$$eras',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Era history',
				items: [
					{
						label: 'era-bounded validator observations',
					},
				],
			},
			{
				label: 'Controller',
				items: [
					{
						label: 'Polkadot account through the latest era when resolved',
					},
				],
			},
			{
				label: 'Network set',
				items: [
					{
						label: 'validator-set context',
					},
				],
			},
			{
				label: 'Nominators/exposure',
				items: [
					{
						label: 'era-bounded exposure rows when modeled',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'eras',
			label: 'eras',
			field: '$$eras',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotValidator>
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
	entityType={EntityType.PolkadotValidator}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
