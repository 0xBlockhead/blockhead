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
		'address',
		'name',
	],
	content: {
		dl: [
			[
				'$network',
				'address',
				'name',
				'$account',
				'$creator',
				'$creationTransaction',
				{
					label: 'latest verification/proxy snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Verification snapshots',
				items: [
					{
						label: 'contract verification/proxy observations',
					},
				],
			},
			{
				label: 'Tokens',
				items: [
					{
						label: 'tokens associated by source evidence',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'contract account identity',
					},
				],
			},
			{
				label: 'Creator',
				items: [
					{
						label: 'creator account identity',
					},
				],
			},
			{
				label: 'Creation transaction',
				items: [
					'$creationTransaction',
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'tokens',
			label: 'tokens',
			field: '$$tokens',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronContract>
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
	entityType={EntityType.TronContract}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
