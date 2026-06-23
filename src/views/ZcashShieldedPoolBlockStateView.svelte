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
			{
				label: 'block',
			},
			'pool',
			{
				label: 'final root',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'block',
					},
					'pool',
					{
						label: 'final root',
					},
					{
						label: 'block commitments',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Block',
					items: [
						{
							label: 'parent UTXO-family block',
						},
					],
				},
				{
					label: 'Pool',
					items: [
						{
							label: 'pool enum/constant metadata',
						},
					],
				},
				{
					label: 'Actions',
					items: [
						{
							label: 'shielded actions in transactions from this block when resolved',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'zcashd getblock finalsaplingroot/blockcommitments fields',
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
			selection: EntityProxyResource<typeof schema, EntityType.ZcashShieldedPoolBlockState>
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
	entityType={EntityType.ZcashShieldedPoolBlockState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
