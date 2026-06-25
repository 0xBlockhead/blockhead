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
		'$viewingKey',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$viewingKey',
				'timestampMs',
				'source',
				'lastScannedHeight',
				{
					label: 'last scanned time',
				},
				{
					label: 'discovered note count',
				},
				{
					label: 'matched nullifier count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Viewing key',
				items: [
					{
						label: 'parent local Zcash viewing key',
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
				label: 'Notes',
				items: [
					{
						label: 'local Zcash note states scoped by key/account',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'zcashd wallet/import scan state or local SDK scan metadata',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZcashViewingKey_Timestamp>
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
	entityType={EntityType.BlockheadZcashViewingKey_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
