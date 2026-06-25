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
		'signature',
		'$block',
	],
	content: {
		dl: [
			[
				'$network',
				'signature',
				'$block',
				'$feePayer',
				{
					label: 'latest status/fee/compute snapshot',
				},
				'$$instructions',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Observations',
				items: [
					{
						label: 'slot/source transaction observations',
					},
				],
			},
			{
				label: 'Instructions',
				items: [
					{
						label: 'instructions grouped by top-level/inner kind',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'parent Solana block',
					},
				],
			},
			{
				label: 'Fee payer',
				items: [
					{
						label: 'fee-payer Solana account',
					},
				],
			},
			{
				label: 'Raw message',
				items: [
					{
						label: 'account keys/address lookup table data when modeled',
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
		{
			id: 'instructions',
			label: 'instructions',
			field: '$$instructions',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaTransaction>
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
	entityType={EntityType.SolanaTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
