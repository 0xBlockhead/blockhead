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
		'$transaction',
		'pool',
		'actionKind',
	],
	content: {
		dl: [
			[
				'$transaction',
				'pool',
				'actionKind',
				'actionIndex',
				'$pool',
			],
			[
				'nullifier',
				'noteCommitment',
				'valueCommitment',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Transaction',
				items: [
					{
						label: 'parent UTXO-family transaction',
					},
				],
			},
			{
				label: 'Pool',
				items: [
					{
						label: 'ZcashShieldedPool ref and pool enum',
					},
				],
			},
			{
				label: 'Public action data',
				items: [
					{
						label: 'nullifier/note/value commitments',
					},
				],
			},
			{
				label: 'Local note match',
				items: [
					{
						label: 'Blockhead Zcash note state when wallet scanning links the action',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZcashShieldedAction>
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
	entityType={EntityType.ZcashShieldedAction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
