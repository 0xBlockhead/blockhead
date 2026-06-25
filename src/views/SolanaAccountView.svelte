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
		'pubkey',
		'$ownerProgram',
	],
	content: {
		dl: [
			[
				'$network',
				'pubkey',
				'$ownerProgram',
			],
			[
				{
					label: 'latest lamports/executable/rent/data snapshot',
				},
				'$$tokenAccounts',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account observations',
				items: [
					{
						label: 'slot-bounded account state observations',
					},
				],
			},
			{
				label: 'Owner program',
				items: [
					{
						label: 'owning Solana program',
					},
				],
			},
			{
				label: 'Token accounts',
				items: [
					{
						label: 'SPL token accounts owned by this pubkey',
					},
				],
			},
			{
				label: 'Transactions/instructions',
				items: [
					{
						label: 'instruction references when reached from transactions',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Solana network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'getAccountInfo',
					},
					{
						label: 'getMultipleAccounts/getProgramAccounts when wired',
					},
					{
						label: 'indexer account payloads',
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
			id: 'token-accounts',
			label: 'token accounts',
			field: '$$tokenAccounts',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaAccount>
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
	entityType={EntityType.SolanaAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
