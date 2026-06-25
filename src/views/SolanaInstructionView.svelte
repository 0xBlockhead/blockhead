<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
	panels: [
		{
			id: 'accounts',
			label: 'Accounts',
			kind: 'details',
			slot: 'InstructionAccounts',
		},
	],
	decodes: [
		{
			field: 'data',
			kind: 'rawBytes',
			slot: 'SolanaInstructionData',
		},
	],
	closed: [
		'$transaction',
		'instructionKind',
		'instructionIndex',
	],
	content: {
		dl: [
			[
				'$transaction',
				'instructionKind',
				'instructionIndex',
				'innerInstructionIndex',
				'$program',
			],
			[
				'parsedType',
				'stackHeight',
				'$$accounts',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Program',
				items: [
					{
						label: 'executing Solana program',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'account refs touched by instruction',
					},
				],
			},
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent Solana transaction',
					},
				],
			},
			{
				label: 'Raw instruction',
				items: [
					{
						label: 'data/base64/parsed payload',
					},
				],
			},
		],
	},
	summary: {
		value: '$transaction',
		title: '$transaction',
		after: [
			'instructionKind',
			'instructionIndex',
		],
	},
	lists: [
		{
			id: 'accounts',
			label: 'accounts',
			field: '$$accounts',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaInstruction>
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
	entityType={EntityType.SolanaInstruction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
