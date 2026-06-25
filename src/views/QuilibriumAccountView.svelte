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
		'accountAddress',
	],
	content: {
		dl: [
			[
				'accountAddress',
			],
			[
				'$network',
				'accountAddress',
				'accountKind',
				{
					label: 'connected account-state count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Connected account state',
				items: [
					{
						label: 'BlockheadQuilibriumAccountState rows for balances',
					},
					{
						label: 'pending queues',
					},
				],
			},
			{
				label: 'Network',
				items: [
					'$network',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'account ref kind',
					},
					{
						label: 'address encoding',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'blockhead-account-states',
			label: 'blockhead account states',
			field: '$$blockheadAccountStates',
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
			selection: EntityProxyResource<typeof schema, EntityType.QuilibriumAccount>
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
	entityType={EntityType.QuilibriumAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
