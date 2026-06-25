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
		'$noteState',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$noteState',
				'timestampMs',
				'source',
				'spent',
				'spendTransactionId',
			],
			[
				{
					label: 'spent height',
				},
				'confirmations',
				{
					label: 'witness availability',
				},
				'lastScannedHeight',
				{
					label: 'last scanned time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Note',
				items: [
					{
						label: 'parent local Zcash note state',
					},
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
			{
				label: 'Public action',
				items: [
					{
						label: 'linked public shielded action when available',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'zcashd wallet',
					},
					{
						label: 'lightwalletd compact block/subtree',
					},
					{
						label: 'or local SDK wallet-store payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZcashNoteState_Timestamp>
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
	entityType={EntityType.BlockheadZcashNoteState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
