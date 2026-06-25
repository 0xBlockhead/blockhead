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
		'$account',
		'slot',
		'source',
	],
	content: {
		dl: [
			[
				'$account',
				'slot',
				'source',
				'timestampMs',
				'lamports',
			],
			[
				'ownerProgramId',
				'executable',
				'rentEpoch',
				'spaceBytes',
				'dataEncoding',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'parent Solana account',
					},
				],
			},
			{
				label: 'Owner program',
				items: [
					{
						label: 'Solana program when ownerProgramId resolves',
					},
				],
			},
			{
				label: 'Parsed data',
				items: [
					{
						label: 'parsedData JSON',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'getAccountInfo/getMultipleAccounts/getProgramAccounts context',
					},
					{
						label: 'payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaAccount_Timestamp>
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
	entityType={EntityType.SolanaAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
