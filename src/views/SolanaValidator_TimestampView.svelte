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
		'$validator',
		'slot',
		'source',
	],
	content: {
		dl: [
			[
				'$validator',
				'slot',
				'source',
				'timestampMs',
				{
					label: 'activated stake',
				},
			],
			[
				'commission',
				'delinquent',
				'lastVoteSlot',
				'rootSlot',
				{
					label: 'epoch-credit summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Validator',
				items: [
					{
						label: 'parent Solana validator',
					},
				],
			},
			{
				label: 'Vote account',
				items: [
					{
						label: 'validator vote account',
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
						label: 'getVoteAccounts current/delinquent payload',
					},
					{
						label: 'commitment',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaValidator_Timestamp>
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
	entityType={EntityType.SolanaValidator_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
