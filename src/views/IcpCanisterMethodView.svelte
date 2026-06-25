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
		'methodName',
		'methodKind',
	],
	content: {
		dl: [
			[
				'$canister',
				'methodName',
				'methodKind',
				{
					label: 'latest Candid signature',
				},
				{
					label: 'certification support',
				},
				{
					label: 'request count when indexed',
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
				label: 'Interface history',
				items: [
					{
						label: 'timestamped method/interface observations',
					},
				],
			},
			{
				label: 'Requests',
				items: [
					{
						label: 'request-status rows filtered by canister/method when known',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Candid interface or dashboard payload',
					},
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.IcpCanisterMethod>
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
	entityType={EntityType.IcpCanisterMethod}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
