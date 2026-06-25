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
		'tokenAccountPubkey',
		'$mint',
	],
	content: {
		dl: [
			[
				'$network',
				'tokenAccountPubkey',
				'$mint',
				'$owner',
				'$delegate',
				'$closeAuthority',
				{
					label: 'latest amount/state/native snapshot',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Observations',
				items: [
					{
						label: 'slot/source token-account state observations',
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
				label: 'Owner',
				items: [
					{
						label: 'owner Solana account',
					},
				],
			},
			{
				label: 'Underlying account',
				items: [
					{
						label: 'underlying Solana account',
					},
				],
			},
			{
				label: 'Delegate/close authority',
				items: [
					{
						label: 'Solana account refs',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'transactions/instructions when indexed',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaTokenAccount>
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
	entityType={EntityType.SolanaTokenAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
