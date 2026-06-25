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
		'walletId',
		'pool',
		'noteCommitment',
	],
	content: {
		dl: [
			[
				'walletId',
				'pool',
				'noteCommitment',
				'valueZatoshis',
				'nullifier',
			],
			[
				'receivedTransactionId',
				{
					label: 'received height',
				},
				'recipientAddress',
				{
					label: 'latest spent state',
				},
				{
					label: 'latest spent transaction id',
				},
			],
			[
				{
					label: 'latest spent height',
				},
				{
					label: 'latest scan time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest note-state observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped note-state observations',
					},
				],
			},
			{
				label: 'Pool/action',
				items: [
					{
						label: 'pool enum/constant metadata',
					},
					{
						label: 'linked public shielded action when available',
					},
				],
			},
			{
				label: 'Memo/address',
				items: [
					{
						label: 'redacted memo',
					},
					'diversifier',
					'recipientAddress',
				],
			},
			{
				label: 'Wallet',
				items: [
					{
						label: 'parent local Zcash wallet state',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZcashNoteState>
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
	entityType={EntityType.BlockheadZcashNoteState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
