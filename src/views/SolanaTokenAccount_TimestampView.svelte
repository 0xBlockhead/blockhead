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
		'$tokenAccount',
		'slot',
		'source',
	],
	content: {
		dl: [
			[
				'$tokenAccount',
				'slot',
				'source',
				'timestampMs',
				'amount',
			],
			[
				'decimals',
				{
					label: 'display amount',
				},
				'state',
				{
					label: 'native flag',
				},
				'delegatedAmount',
			],
			[
				{
					label: 'rent reserve',
				},
				{
					label: 'owner',
				},
				{
					label: 'mint',
				},
				{
					label: 'delegate',
				},
				{
					label: 'close authority',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Token account',
				items: [
					{
						label: 'parent Solana token account',
					},
				],
			},
			{
				label: 'Mint',
				items: [
					{
						label: 'parent Solana token mint',
					},
				],
			},
			{
				label: 'Owner/delegate/close authority',
				items: [
					{
						label: 'Solana account refs',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'jsonParsed token account payload',
					},
					{
						label: 'RPC context',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaTokenAccount_Timestamp>
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
	entityType={EntityType.SolanaTokenAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
