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
			label: 'receipt id',
		},
		{
			label: 'predecessor account',
		},
		{
			label: 'receiver account',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'receipt id',
				},
				{
					label: 'predecessor account',
				},
				{
					label: 'receiver account',
				},
				{
					label: 'linked outcome when available',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Predecessor',
				items: [
					{
						label: 'predecessor NEAR account',
					},
				],
			},
			{
				label: 'Receiver',
				items: [
					{
						label: 'receiver NEAR account',
					},
				],
			},
			{
				label: 'Execution outcome',
				items: [
					{
						label: 'linked execution outcome',
					},
				],
			},
			{
				label: 'Spawned receipts',
				items: [
					{
						label: 'child receipts when available from tx/status',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearReceipt>
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
	entityType={EntityType.NearReceipt}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
