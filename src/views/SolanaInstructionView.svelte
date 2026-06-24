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
		{
			label: 'transaction',
		},
		{
			label: 'instruction kind',
		},
		{
			label: 'instruction index',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'transaction',
				},
				{
					label: 'instruction kind',
				},
				{
					label: 'instruction index',
				},
				{
					label: 'inner instruction index',
				},
				{
					label: 'program',
				},
				{
					label: 'parsed type',
				},
				{
					label: 'stack height',
				},
				{
					label: 'account count',
				},
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
